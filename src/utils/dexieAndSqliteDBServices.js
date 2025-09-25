// utils/databaseService.js
import Dexie from "dexie";
import {
  CapacitorSQLite,
  SQLiteConnection,
  SQLiteDBConnection,
} from "@capacitor-community/sqlite";
import { Capacitor } from "@capacitor/core";

// Platform detection
const isNative = Capacitor.isNativePlatform();
const isWeb = Capacitor.getPlatform() === "web";

// =====================================
// DEXIE SETUP (WEB)
// =====================================
class OfflineDB extends Dexie {
  constructor() {
    super("OfflineAppDB");
    this.version(1).stores({
      notes: "++id, type, note, blob, source, synced, createdAt",
    });
  }
}

let dexieDB = null;
if (isWeb) {
  dexieDB = new OfflineDB();
}

// =====================================
// SQLITE SETUP (MOBILE)
// =====================================
let sqliteConnection = null;
let db = null;

const initSQLite = async () => {
  if (!isNative) return;

  try {
    sqliteConnection = new SQLiteConnection(CapacitorSQLite);

    const dbName = "offlineapp.db";
    const encrypted = false;
    const mode = "no-encryption";
    const version = 1;

    const ret = await sqliteConnection.checkConnectionsConsistency();
    const isConn = (await sqliteConnection.isConnection(dbName, false)).result;

    if (ret.result && isConn) {
      db = await sqliteConnection.retrieveConnection(dbName, false);
    } else {
      db = await sqliteConnection.createConnection(
        dbName,
        encrypted,
        mode,
        version,
        false
      );
    }

    await db.open();

    // Create table if not exists
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL,
        note TEXT,
        blob BLOB,
        source TEXT,
        synced INTEGER DEFAULT 0,
        createdAt TEXT NOT NULL
      );
    `;

    await db.execute(createTableSQL);
    console.log("✅ SQLite initialized successfully");
  } catch (error) {
    console.error("❌ SQLite initialization failed:", error);
    throw error;
  }
};

// =====================================
// UTILITY FUNCTIONS
// =====================================
const blobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const base64ToBlob = (base64String, mimeType = "image/jpeg") => {
  const base64 = base64String.split(",")[1];
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
};

// =====================================
// UNIFIED API FUNCTIONS
// =====================================

// Initialize database
export async function initDatabase() {
  if (isNative) {
    await initSQLite();
  }
  // Dexie initializes automatically for web
}

// Save text note
export async function saveNoteOffline(noteText) {
  const newNote = {
    type: "note",
    note: noteText,
    synced: 0, // SQLite uses INTEGER for boolean
    createdAt: new Date().toISOString(),
  };

  try {
    if (isWeb && dexieDB) {
      await dexieDB.notes.add(newNote);
    } else if (isNative && db) {
      const query = `
        INSERT INTO notes (type, note, synced, createdAt) 
        VALUES (?, ?, ?, ?)
      `;
      await db.run(query, [
        newNote.type,
        newNote.note,
        newNote.synced,
        newNote.createdAt,
      ]);
    }
    console.log("✅ Note saved successfully");
  } catch (error) {
    console.error("❌ Failed to save note:", error);
    throw error;
  }
}

// Save image (Blob)
export async function saveImageOffline(blob, source = "camera") {
  try {
    const newImage = {
      type: "image",
      source,
      synced: 0,
      createdAt: new Date().toISOString(),
    };

    if (isWeb && dexieDB) {
      // Store blob directly in Dexie
      newImage.blob = blob;
      await dexieDB.notes.add(newImage);
    } else if (isNative && db) {
      // Convert blob to base64 for SQLite storage
      const base64String = await blobToBase64(blob);
      const query = `
        INSERT INTO notes (type, blob, source, synced, createdAt) 
        VALUES (?, ?, ?, ?, ?)
      `;
      await db.run(query, [
        newImage.type,
        base64String,
        newImage.source,
        newImage.synced,
        newImage.createdAt,
      ]);
    }
    console.log("✅ Image saved successfully");
  } catch (error) {
    console.error("❌ Failed to save image:", error);
    throw error;
  }
}

// Get all notes + images
export async function getNotes() {
  try {
    let items = [];

    if (isWeb && dexieDB) {
      items = await dexieDB.notes.orderBy("createdAt").reverse().toArray();
      // Convert synced values to boolean for consistency
      items = items.map((item) => ({
        ...item,
        key: item.id, // Use id as key for consistency
        synced: !!item.synced,
      }));
    } else if (isNative && db) {
      const query = `SELECT * FROM notes ORDER BY createdAt DESC`;
      const result = await db.query(query);

      items =
        result.values?.map((row) => ({
          id: row.id,
          key: row.id, // Use id as key for consistency
          type: row.type,
          note: row.note,
          blob: row.blob ? base64ToBlob(row.blob) : null,
          source: row.source,
          synced: !!row.synced,
          createdAt: row.createdAt,
        })) || [];
    }

    return items;
  } catch (error) {
    console.error("❌ Failed to get notes:", error);
    return [];
  }
}

// Delete note or image by ID
export async function deleteNote(noteId) {
  try {
    if (isWeb && dexieDB) {
      await dexieDB.notes.delete(noteId);
    } else if (isNative && db) {
      const query = `DELETE FROM notes WHERE id = ?`;
      await db.run(query, [noteId]);
    }
    console.log(`✅ Successfully deleted item ${noteId}`);
    return true;
  } catch (error) {
    console.error("❌ Error deleting item:", error);
    return false;
  }
}

// Sync data to backend
export async function syncNotes() {
  try {
    let unsyncedItems = [];

    if (isWeb && dexieDB) {
      unsyncedItems = await dexieDB.notes.where("synced").equals(0).toArray();
    } else if (isNative && db) {
      const query = `SELECT * FROM notes WHERE synced = 0`;
      const result = await db.query(query);
      unsyncedItems =
        result.values?.map((row) => ({
          id: row.id,
          type: row.type,
          note: row.note,
          blob: row.blob,
          source: row.source,
          synced: row.synced,
          createdAt: row.createdAt,
        })) || [];
    }

    for (const item of unsyncedItems) {
      try {
        if (item.type === "note") {
          console.log("DATA Note ==>", item.note);
          // await fetch("https://your-api/notes", {
          //   method: 'POST',
          //   headers: { 'Content-Type': 'application/json' },
          //   body: JSON.stringify({ note: item.note, createdAt: item.createdAt })
          // });
        } else if (item.type === "image") {
          const formData = new FormData();

          if (isWeb) {
            formData.append("file", item.blob, `img-${item.id}.jpg`);
          } else {
            // Convert base64 back to blob for upload
            const blob = base64ToBlob(item.blob);
            formData.append("file", blob, `img-${item.id}.jpg`);
          }

          formData.append("source", item.source);
          console.log("DATA Image ==>", formData.get("file"), item.source);
          // await fetch("https://your-api/images", {
          //   method: 'POST',
          //   body: formData
          // });
        }

        // Mark as synced
        if (isWeb && dexieDB) {
          await dexieDB.notes.update(item.id, { synced: 1 });
        } else if (isNative && db) {
          const updateQuery = `UPDATE notes SET synced = 1 WHERE id = ?`;
          await db.run(updateQuery, [item.id]);
        }

        console.log(`✅ Synced item ${item.id}`);
      } catch (syncError) {
        console.error(`❌ Sync failed for item ${item.id}:`, syncError);
      }
    }
  } catch (error) {
    console.error("❌ Sync process failed:", error);
    throw error;
  }
}

// Clear all data (useful for testing)
export async function clearAllData() {
  try {
    if (isWeb && dexieDB) {
      await dexieDB.notes.clear();
    } else if (isNative && db) {
      await db.run(`DELETE FROM notes`);
    }
    console.log("✅ All data cleared");
  } catch (error) {
    console.error("❌ Failed to clear data:", error);
  }
}

// Close database connections (call on app shutdown)
export async function closeDatabase() {
  try {
    if (isNative && db) {
      await sqliteConnection.closeConnection(db.databaseName, false);
      console.log("✅ SQLite connection closed");
    }
    // Dexie closes automatically
  } catch (error) {
    console.error("❌ Failed to close database:", error);
  }
}
