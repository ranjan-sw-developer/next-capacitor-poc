import localforage from "localforage";

// ✅ Configure localForage store
localforage.config({
  name: "OfflineApp",
  storeName: "notes_images",
});

// Save text note
export async function saveNoteOffline(note) {
  const newNote = {
    type: "note",
    note,
    synced: false,
    createdAt: new Date().toISOString(),
  };
  await localforage.setItem(`note-${Date.now()}`, newNote);
}

// Save image (Blob or Base64)
export async function saveImageOffline(blob, source = "camera") {
  const newImage = {
    type: "image",
    blob,
    source,
    synced: false,
    createdAt: new Date().toISOString(),
  };
  await localforage.setItem(`img-${Date.now()}`, newImage);
}

// Get all notes + images (with storage key)
export async function getNotes() {
  const items = [];
  await localforage.iterate((value, key) => {
    items.push({ key, ...value }); // ✅ merge key into object
  });
  return items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

// Delete note or image by key
export async function deleteNote(key) {
  try {
    await localforage.removeItem(key);
    const check = await localforage.getItem(key);
    if (check === null) {
      console.log(`🗑️ Successfully deleted ${key}`);
      return true;
    } else {
      console.error(`❌ Failed to delete ${key}`);
      return false;
    }
  } catch (err) {
    console.error("❌ Error deleting item:", err);
    return false;
  }
}

// Sync data to backend
export async function syncNotes() {
  const keys = await localforage.keys();

  for (const key of keys) {
    const item = await localforage.getItem(key);
    if (!item.synced) {
      try {
        if (item.type === "note") {
          console.log("DATA Note ==>", item.note);
          // await fetch("https://your-api/notes", { ... });
        } else if (item.type === "image") {
          const formData = new FormData();
          formData.append("file", item.blob, `${key}.jpg`);
          formData.append("source", item.source);
          console.log("DATA Image ==>", formData.get("file"), item.source);
          // await fetch("https://your-api/images", { ... });
        }

        // ✅ Mark as synced
        item.synced = true;
        await localforage.setItem(key, item);
        getNotes();
      } catch (err) {
        console.error("❌ Sync failed for", key, err);
      }
    }
  }
}
