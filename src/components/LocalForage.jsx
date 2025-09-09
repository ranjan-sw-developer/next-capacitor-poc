"use client";

import { useEffect, useState } from "react";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import {
  saveNoteOffline,
  syncNotes,
  getNotes,
  saveImageOffline,
  deleteNote,
} from "../utils/localForageService";

export default function LocalForage({ isOnline }) {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState({
    saving: false,
    syncing: false,
    picking: false,
  });

  const addNote = async () => {
    if (!note.trim()) return;
    setIsLoading((p) => ({ ...p, saving: true }));
    await saveNoteOffline(note.trim());
    setNote("");
    setNotes(await getNotes());
    setIsLoading((p) => ({ ...p, saving: false }));
  };

  const doSync = async () => {
    setIsLoading((p) => ({ ...p, syncing: true }));
    await syncNotes();
    setNotes(await getNotes());
    setIsLoading((p) => ({ ...p, syncing: false }));
  };

  const pickOrCapture = async (source) => {
    setIsLoading((p) => ({ ...p, picking: true }));
    try {
      const photo = await Camera.getPhoto({
        quality: 80,
        resultType: CameraResultType.Uri,
        source,
      });

      const response = await fetch(photo.webPath);
      const blob = await response.blob();

      await saveImageOffline(
        blob,
        source === CameraSource.Camera ? "camera" : "gallery"
      );
      setNotes(await getNotes());
    } catch (err) {
      console.error("❌ Image capture failed:", err);
    } finally {
      setIsLoading((p) => ({ ...p, picking: false }));
    }
  };

  const handleDelete = async (noteId) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      const success = await deleteNote(noteId);
      if (success) {
        setNotes((prev) => prev.filter((item) => item.key !== noteId));
      }
    }
  };

  useEffect(() => {
    if (isOnline) doSync();
  }, [isOnline]);

  const pendingNotes = notes.filter((n) => !n.synced);
  const syncedNotes = notes.filter((n) => n.synced);

  return (
    <div className="m-2 bg-white/95 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 transition-transform hover:-translate-y-1 hover:shadow-xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-lg bg-gradient-to-br from-pink-400 to-pink-200">
            📝
          </div>
          <h2 className="text-lg font-semibold text-gray-800">Offline Sync</h2>
        </div>
        <span
          className={`px-2 py-1 rounded-full font-medium text-sm ${
            isOnline ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {isOnline ? "🟢 Online" : "🔴 Offline"}
        </span>
      </div>

      {/* Sync Info */}
      <div className="bg-gray-100 rounded-md p-2 mb-4 text-sm">
        📊 Total: {notes.length} | ✅ Synced: {syncedNotes.length} | ⚡ Pending:{" "}
        {pendingNotes.length}
      </div>

      {/* Input */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Enter your note here..."
          className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          maxLength={200}
          onKeyPress={(e) => e.key === "Enter" && addNote()}
        />
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 mb-4">
        <button
          onClick={addNote}
          disabled={isLoading.saving || !note.trim()}
          className={`px-4 py-2 rounded-lg font-semibold text-white ${
            isLoading.saving
              ? "bg-green-400 cursor-not-allowed"
              : "bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
          }`}
        >
          {isLoading.saving ? "💾 Saving..." : "💾 Save Note"}
        </button>

        <button
          onClick={() => pickOrCapture(CameraSource.Camera)}
          disabled={isLoading.picking}
          className={`px-4 py-2 rounded-lg font-semibold text-white ${
            isLoading.picking
              ? "bg-indigo-300 cursor-not-allowed"
              : "bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
          }`}
        >
          {isLoading.picking ? "📷 Capturing..." : "📷 Take Picture"}
        </button>

        <button
          onClick={() => pickOrCapture(CameraSource.Photos)}
          disabled={isLoading.picking}
          className={`px-4 py-2 rounded-lg font-semibold text-white ${
            isLoading.picking
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-gradient-to-br from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700"
          }`}
        >
          {isLoading.picking ? "🖼️ Picking..." : "🖼️ Pick from Gallery"}
        </button>

        <button
          onClick={doSync}
          disabled={isLoading.syncing}
          className={`px-4 py-2 rounded-lg font-semibold ${
            pendingNotes.length > 0
              ? "bg-yellow-400 text-gray-800 hover:bg-yellow-500"
              : "bg-gray-400 text-white cursor-not-allowed"
          }`}
        >
          {isLoading.syncing
            ? "🔄 Syncing..."
            : pendingNotes.length > 0
            ? `🔄 Sync ${pendingNotes.length} Items`
            : "✅ All Synced"}
        </button>
      </div>

      {/* Notes List */}
      {notes.length === 0 ? (
        <div className="text-center py-8 text-gray-500 italic">
          📝 No notes or images yet. Add your first item!
        </div>
      ) : (
        <ul className="space-y-3">
          {notes.map((item, index) => (
            <li
              key={index}
              className="flex flex-row justify-between items-start bg-white p-4 border rounded-lg"
            >
              <div className="flex-1 mb-2 sm:mb-0 sm:mr-4">
                {item.type === "note" ? (
                  <p className="text-gray-800 text-sm">{item.note}</p>
                ) : (
                  <div className="flex flex-col">
                    <img
                      src={URL.createObjectURL(item.blob)}
                      alt="Offline"
                      className="w-28 h-28 object-cover rounded-md mb-1"
                    />
                    <span className="text-xs text-gray-500 bg-gray-100 px-1 rounded">
                      📷 {item.source || "unknown"}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-col items-end gap-1">
                <span
                  className={`text-sm px-1 rounded ${
                    item.synced
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                  title={item.synced ? "Synced to server" : "Pending sync"}
                >
                  {item.synced ? "✅" : "⚡"}
                </span>
                <span className="text-xs text-gray-500">
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString()
                    : new Date().toLocaleDateString()}
                </span>
                {/* <button
                  onClick={() => handleDelete(item.id || index)}
                  className="text-red-600 hover:bg-red-100 px-1 rounded"
                  title="Delete item"
                >
                  🗑️
                </button> */}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
