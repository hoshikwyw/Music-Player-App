import { useState, useRef } from "react";
import {
  useAdminSongs, useAddSong, useUpdateSong, useDeleteSong,
  useAdminArtists, useAddArtist, useUpdateArtist, useDeleteArtist,
  useAdminAlbums, useAddAlbum, useUpdateAlbum, useDeleteAlbum,
  useCategories, useUploadFile,
} from "../hooks/useSupabase";
import {
  BsMusicNoteBeamed, BsPeopleFill, BsDisc, BsPlus, BsPencil,
  BsTrash, BsUpload, BsX, BsCheck, BsShieldLock,
} from "react-icons/bs";

const ADMIN_KEY = import.meta.env.VITE_ADMIN_SECRET || "admin123";

// ============================================
// Auth Gate
// ============================================
const useAdminAuth = () => {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem("admin_authed") === "1");
  const login = (key) => {
    if (key === ADMIN_KEY) {
      sessionStorage.setItem("admin_authed", "1");
      setAuthed(true);
      return true;
    }
    return false;
  };
  const logout = () => {
    sessionStorage.removeItem("admin_authed");
    setAuthed(false);
  };
  return { authed, login, logout };
};

const AdminLogin = ({ onLogin }) => {
  const [key, setKey] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!onLogin(key)) setError(true);
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="retro-card p-6 sm:p-8 w-full max-w-sm">
        <div className="flex items-center gap-2 mb-5">
          <BsShieldLock className="text-primary text-xl" />
          <h2 className="text-lg font-bold text-text-primary">Admin Access</h2>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="password"
            placeholder="Enter admin key..."
            value={key}
            onChange={(e) => { setKey(e.target.value); setError(false); }}
            className="retro-input text-sm"
            autoFocus
          />
          {error && <p className="text-xs text-danger font-semibold">Invalid key. Try again.</p>}
          <button type="submit" className="retro-btn text-sm">Unlock</button>
        </form>
      </div>
    </div>
  );
};

// ============================================
// File Upload Button
// ============================================
const FileUpload = ({ bucket, onUploaded, label }) => {
  const inputRef = useRef(null);
  const { mutate: upload, isPending } = useUploadFile();

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const path = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    upload({ bucket, path, file }, {
      onSuccess: (url) => onUploaded(url),
    });
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isPending}
        className="retro-btn-outline !text-xs !px-2.5 !py-1.5 flex items-center gap-1.5"
      >
        <BsUpload className="text-[10px]" />
        {isPending ? "Uploading..." : label || "Upload"}
      </button>
      <input ref={inputRef} type="file" className="hidden" onChange={handleFile} />
    </div>
  );
};

// ============================================
// Tab Button
// ============================================
const Tab = ({ active, icon: Icon, label, count, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-[10px] transition-all ${
      active ? "bg-primary text-white" : "text-text-secondary hover:bg-background-secondary"
    }`}
  >
    <Icon className="text-sm" />
    {label}
    {count != null && (
      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-retro-mono ${
        active ? "bg-white/20 text-white" : "bg-background-secondary text-text-muted"
      }`}>
        {count}
      </span>
    )}
  </button>
);

// ============================================
// Confirm Delete Modal
// ============================================
const ConfirmDelete = ({ name, onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="retro-card p-5 max-w-sm w-full">
      <h3 className="font-bold text-text-primary mb-2">Delete &quot;{name}&quot;?</h3>
      <p className="text-sm text-text-muted mb-4">This action cannot be undone.</p>
      <div className="flex gap-2 justify-end">
        <button onClick={onCancel} className="retro-btn-outline !text-xs !px-3 !py-1.5">Cancel</button>
        <button onClick={onConfirm} className="retro-btn !text-xs !px-3 !py-1.5 !bg-danger !border-danger">Delete</button>
      </div>
    </div>
  </div>
);

// ============================================
// Songs Tab
// ============================================
const SongsTab = () => {
  const { data: songs, isLoading } = useAdminSongs();
  const { data: artists } = useAdminArtists();
  const { data: albums } = useAdminAlbums();
  const { data: categories } = useCategories();
  const { mutate: addSong, isPending: isAdding } = useAddSong();
  const { mutate: updateSong } = useUpdateSong();
  const { mutate: deleteSong } = useDeleteSong();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState({
    id: "", title: "", artist_id: "", artist_name: "", album_id: "",
    category_id: "", genre: "", cover_url: "", audio_url: "", duration: 0, lyrics: "",
  });

  const resetForm = () => {
    setForm({ id: "", title: "", artist_id: "", artist_name: "", album_id: "", category_id: "", genre: "", cover_url: "", audio_url: "", duration: 0, lyrics: "" });
    setEditing(null);
    setShowForm(false);
  };

  const openEdit = (song) => {
    setForm({
      id: song.id, title: song.title, artist_id: song.artist_id || "",
      artist_name: song.artist_name, album_id: song.album_id || "",
      category_id: song.category_id || "", genre: song.genre || "",
      cover_url: song.cover_url || "", audio_url: song.audio_url || "",
      duration: song.duration || 0, lyrics: song.lyrics?.join("\n") || "",
    });
    setEditing(song.id);
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      id: form.id || `song-${Date.now()}`,
      duration: parseInt(form.duration) || 0,
      lyrics: form.lyrics ? form.lyrics.split("\n").filter(Boolean) : null,
      album_id: form.album_id || null,
      category_id: form.category_id || null,
    };
    if (editing) {
      updateSong(payload, { onSuccess: resetForm });
    } else {
      addSong(payload, { onSuccess: resetForm });
    }
  };

  // Auto-fill artist_name when artist_id changes
  const handleArtistChange = (artistId) => {
    const artist = artists?.find((a) => a.id === artistId);
    setForm((f) => ({ ...f, artist_id: artistId, artist_name: artist?.name || "" }));
  };

  // Auto-fill genre when category changes
  const handleCategoryChange = (catId) => {
    const cat = categories?.find((c) => c.id === catId);
    setForm((f) => ({ ...f, category_id: catId, genre: cat?.name || "" }));
  };

  if (isLoading) return <p className="text-sm text-text-muted p-4">Loading songs...</p>;

  return (
    <div>
      {deleteTarget && (
        <ConfirmDelete
          name={deleteTarget.title}
          onConfirm={() => { deleteSong(deleteTarget.id); setDeleteTarget(null); }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-text-primary">{songs?.length || 0} Songs</h3>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="retro-btn !text-xs !px-3 !py-1.5 flex items-center gap-1.5">
          <BsPlus className="text-sm" /> Add Song
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="retro-card p-4 mb-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-text-primary">{editing ? "Edit Song" : "New Song"}</h4>
            <button type="button" onClick={resetForm} className="text-text-muted hover:text-text-primary"><BsX size={18} /></button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input placeholder="Title *" value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} className="retro-input text-sm" required />
            <select value={form.artist_id} onChange={(e) => handleArtistChange(e.target.value)} className="retro-input text-sm" required>
              <option value="">Select Artist *</option>
              {artists?.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
            <select value={form.album_id} onChange={(e) => setForm(f => ({ ...f, album_id: e.target.value }))} className="retro-input text-sm">
              <option value="">Select Album (optional)</option>
              {albums?.filter(al => !form.artist_id || al.artist_id === form.artist_id).map((a) => <option key={a.id} value={a.id}>{a.title}</option>)}
            </select>
            <select value={form.category_id} onChange={(e) => handleCategoryChange(e.target.value)} className="retro-input text-sm">
              <option value="">Select Category</option>
              {categories?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <input placeholder="Duration (seconds)" type="number" value={form.duration} onChange={(e) => setForm(f => ({ ...f, duration: e.target.value }))} className="retro-input text-sm" />
            {!editing && <input placeholder="Custom ID (auto if empty)" value={form.id} onChange={(e) => setForm(f => ({ ...f, id: e.target.value }))} className="retro-input text-sm" />}
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <div className="flex-1 min-w-[200px]">
              <input placeholder="Cover image URL" value={form.cover_url} onChange={(e) => setForm(f => ({ ...f, cover_url: e.target.value }))} className="retro-input text-sm w-full" />
            </div>
            <FileUpload bucket="covers" label="Upload Cover" onUploaded={(url) => setForm(f => ({ ...f, cover_url: url }))} />
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <div className="flex-1 min-w-[200px]">
              <input placeholder="Audio file URL" value={form.audio_url} onChange={(e) => setForm(f => ({ ...f, audio_url: e.target.value }))} className="retro-input text-sm w-full" />
            </div>
            <FileUpload bucket="audio" label="Upload Audio" onUploaded={(url) => setForm(f => ({ ...f, audio_url: url }))} />
          </div>

          <textarea placeholder="Lyrics (one line per row)" value={form.lyrics} onChange={(e) => setForm(f => ({ ...f, lyrics: e.target.value }))} rows={4} className="retro-input text-sm w-full" />

          <button type="submit" disabled={isAdding} className="retro-btn !text-xs !px-4 !py-2 flex items-center gap-1.5">
            <BsCheck size={14} /> {editing ? "Update" : "Add"} Song
          </button>
        </form>
      )}

      <div className="retro-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-border bg-surface text-left">
                <th className="px-3 py-2.5 text-[11px] font-bold text-text-muted font-retro-mono">COVER</th>
                <th className="px-3 py-2.5 text-[11px] font-bold text-text-muted font-retro-mono">TITLE</th>
                <th className="px-3 py-2.5 text-[11px] font-bold text-text-muted font-retro-mono hidden sm:table-cell">ARTIST</th>
                <th className="px-3 py-2.5 text-[11px] font-bold text-text-muted font-retro-mono hidden md:table-cell">ALBUM</th>
                <th className="px-3 py-2.5 text-[11px] font-bold text-text-muted font-retro-mono hidden md:table-cell">GENRE</th>
                <th className="px-3 py-2.5 text-[11px] font-bold text-text-muted font-retro-mono hidden lg:table-cell">PLAYS</th>
                <th className="px-3 py-2.5 text-[11px] font-bold text-text-muted font-retro-mono text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {songs?.map((song) => (
                <tr key={song.id} className="border-b border-border/30 hover:bg-background-secondary transition-colors">
                  <td className="px-3 py-2">
                    <div className="w-9 h-9 rounded-lg overflow-hidden border border-border bg-surface">
                      {song.cover_url ? (
                        <img src={song.cover_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><BsMusicNoteBeamed className="text-text-muted text-xs" /></div>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <p className="font-semibold text-text-primary truncate max-w-[150px]">{song.title}</p>
                    <p className="text-[10px] text-text-muted sm:hidden">{song.artist_name}</p>
                  </td>
                  <td className="px-3 py-2 text-text-secondary hidden sm:table-cell truncate max-w-[120px]">{song.artists?.name || song.artist_name}</td>
                  <td className="px-3 py-2 text-text-muted text-xs hidden md:table-cell truncate max-w-[120px]">{song.albums?.title || "—"}</td>
                  <td className="px-3 py-2 hidden md:table-cell">
                    {song.genre && <span className="retro-badge text-[9px]">{song.genre}</span>}
                  </td>
                  <td className="px-3 py-2 text-text-muted font-retro-mono text-xs hidden lg:table-cell">{(song.play_count || 0).toLocaleString()}</td>
                  <td className="px-3 py-2 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(song)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-primary/10 text-text-muted hover:text-primary transition-colors">
                        <BsPencil className="text-xs" />
                      </button>
                      <button onClick={() => setDeleteTarget(song)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-danger/10 text-text-muted hover:text-danger transition-colors">
                        <BsTrash className="text-xs" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ============================================
// Artists Tab
// ============================================
const ArtistsTab = () => {
  const { data: artists, isLoading } = useAdminArtists();
  const { mutate: addArtist, isPending: isAdding } = useAddArtist();
  const { mutate: updateArtist } = useUpdateArtist();
  const { mutate: deleteArtist } = useDeleteArtist();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState({ id: "", name: "", bio: "", avatar_url: "" });

  const resetForm = () => { setForm({ id: "", name: "", bio: "", avatar_url: "" }); setEditing(null); setShowForm(false); };

  const openEdit = (artist) => {
    setForm({ id: artist.id, name: artist.name, bio: artist.bio || "", avatar_url: artist.avatar_url || "" });
    setEditing(artist.id);
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...form, id: form.id || `artist-${Date.now()}` };
    if (editing) {
      updateArtist(payload, { onSuccess: resetForm });
    } else {
      addArtist(payload, { onSuccess: resetForm });
    }
  };

  if (isLoading) return <p className="text-sm text-text-muted p-4">Loading artists...</p>;

  return (
    <div>
      {deleteTarget && (
        <ConfirmDelete
          name={deleteTarget.name}
          onConfirm={() => { deleteArtist(deleteTarget.id); setDeleteTarget(null); }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-text-primary">{artists?.length || 0} Artists</h3>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="retro-btn !text-xs !px-3 !py-1.5 flex items-center gap-1.5">
          <BsPlus className="text-sm" /> Add Artist
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="retro-card p-4 mb-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-text-primary">{editing ? "Edit Artist" : "New Artist"}</h4>
            <button type="button" onClick={resetForm} className="text-text-muted hover:text-text-primary"><BsX size={18} /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input placeholder="Name *" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} className="retro-input text-sm" required />
            {!editing && <input placeholder="Custom ID (auto if empty)" value={form.id} onChange={(e) => setForm(f => ({ ...f, id: e.target.value }))} className="retro-input text-sm" />}
          </div>
          <textarea placeholder="Bio" value={form.bio} onChange={(e) => setForm(f => ({ ...f, bio: e.target.value }))} rows={2} className="retro-input text-sm w-full" />
          <div className="flex flex-wrap gap-2 items-center">
            <div className="flex-1 min-w-[200px]">
              <input placeholder="Avatar URL" value={form.avatar_url} onChange={(e) => setForm(f => ({ ...f, avatar_url: e.target.value }))} className="retro-input text-sm w-full" />
            </div>
            <FileUpload bucket="covers" label="Upload Avatar" onUploaded={(url) => setForm(f => ({ ...f, avatar_url: url }))} />
          </div>
          <button type="submit" disabled={isAdding} className="retro-btn !text-xs !px-4 !py-2 flex items-center gap-1.5">
            <BsCheck size={14} /> {editing ? "Update" : "Add"} Artist
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {artists?.map((artist) => (
          <div key={artist.id} className="retro-card p-3 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full border-2 border-border overflow-hidden flex-shrink-0 bg-surface">
              {artist.avatar_url ? (
                <img src={artist.avatar_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center"><BsPeopleFill className="text-text-muted" /></div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-text-primary text-sm truncate">{artist.name}</p>
              <p className="text-[10px] text-text-muted truncate">{artist.bio || "No bio"}</p>
            </div>
            <div className="flex gap-1 flex-shrink-0">
              <button onClick={() => openEdit(artist)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-primary/10 text-text-muted hover:text-primary transition-colors">
                <BsPencil className="text-xs" />
              </button>
              <button onClick={() => setDeleteTarget(artist)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-danger/10 text-text-muted hover:text-danger transition-colors">
                <BsTrash className="text-xs" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================
// Albums Tab
// ============================================
const AlbumsTab = () => {
  const { data: albums, isLoading } = useAdminAlbums();
  const { data: artists } = useAdminArtists();
  const { mutate: addAlbum, isPending: isAdding } = useAddAlbum();
  const { mutate: updateAlbum } = useUpdateAlbum();
  const { mutate: deleteAlbum } = useDeleteAlbum();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState({ id: "", title: "", artist_id: "", cover_url: "", release_date: "" });

  const resetForm = () => { setForm({ id: "", title: "", artist_id: "", cover_url: "", release_date: "" }); setEditing(null); setShowForm(false); };

  const openEdit = (album) => {
    setForm({ id: album.id, title: album.title, artist_id: album.artist_id || "", cover_url: album.cover_url || "", release_date: album.release_date || "" });
    setEditing(album.id);
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      id: form.id || `album-${Date.now()}`,
      release_date: form.release_date || null,
    };
    if (editing) {
      updateAlbum(payload, { onSuccess: resetForm });
    } else {
      addAlbum(payload, { onSuccess: resetForm });
    }
  };

  if (isLoading) return <p className="text-sm text-text-muted p-4">Loading albums...</p>;

  return (
    <div>
      {deleteTarget && (
        <ConfirmDelete
          name={deleteTarget.title}
          onConfirm={() => { deleteAlbum(deleteTarget.id); setDeleteTarget(null); }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-text-primary">{albums?.length || 0} Albums</h3>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="retro-btn !text-xs !px-3 !py-1.5 flex items-center gap-1.5">
          <BsPlus className="text-sm" /> Add Album
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="retro-card p-4 mb-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-text-primary">{editing ? "Edit Album" : "New Album"}</h4>
            <button type="button" onClick={resetForm} className="text-text-muted hover:text-text-primary"><BsX size={18} /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input placeholder="Title *" value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} className="retro-input text-sm" required />
            <select value={form.artist_id} onChange={(e) => setForm(f => ({ ...f, artist_id: e.target.value }))} className="retro-input text-sm" required>
              <option value="">Select Artist *</option>
              {artists?.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
            <input type="date" placeholder="Release Date" value={form.release_date} onChange={(e) => setForm(f => ({ ...f, release_date: e.target.value }))} className="retro-input text-sm" />
            {!editing && <input placeholder="Custom ID (auto if empty)" value={form.id} onChange={(e) => setForm(f => ({ ...f, id: e.target.value }))} className="retro-input text-sm" />}
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <div className="flex-1 min-w-[200px]">
              <input placeholder="Cover URL" value={form.cover_url} onChange={(e) => setForm(f => ({ ...f, cover_url: e.target.value }))} className="retro-input text-sm w-full" />
            </div>
            <FileUpload bucket="covers" label="Upload Cover" onUploaded={(url) => setForm(f => ({ ...f, cover_url: url }))} />
          </div>
          <button type="submit" disabled={isAdding} className="retro-btn !text-xs !px-4 !py-2 flex items-center gap-1.5">
            <BsCheck size={14} /> {editing ? "Update" : "Add"} Album
          </button>
        </form>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {albums?.map((album) => (
          <div key={album.id} className="retro-card p-2.5">
            <div className="w-full aspect-square rounded-lg overflow-hidden border border-border bg-surface mb-2">
              {album.cover_url ? (
                <img src={album.cover_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center"><BsDisc className="text-text-muted text-2xl" /></div>
              )}
            </div>
            <p className="font-semibold text-text-primary text-[12px] truncate">{album.title}</p>
            <p className="text-[10px] text-text-muted truncate">{album.artists?.name || "Unknown"}</p>
            {album.release_date && <p className="text-[9px] text-text-muted font-retro-mono mt-0.5">{album.release_date}</p>}
            <div className="flex gap-1 mt-2">
              <button onClick={() => openEdit(album)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-primary/10 text-text-muted hover:text-primary transition-colors">
                <BsPencil className="text-xs" />
              </button>
              <button onClick={() => setDeleteTarget(album)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-danger/10 text-text-muted hover:text-danger transition-colors">
                <BsTrash className="text-xs" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================
// Main Dashboard
// ============================================
const AdminDashboard = () => {
  const { authed, login, logout } = useAdminAuth();
  const [activeTab, setActiveTab] = useState("songs");

  if (!authed) return <AdminLogin onLogin={login} />;

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mt-2 sm:mt-4 mb-4 sm:mb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary flex items-center gap-2">
            <BsShieldLock className="text-primary" />
            Admin Dashboard
          </h2>
          <p className="text-[10px] sm:text-[11px] text-text-muted mt-0.5 font-retro-mono">
            MANAGE YOUR MUSIC LIBRARY
          </p>
        </div>
        <button onClick={logout} className="retro-btn-outline !text-xs !px-3 !py-1.5">Logout</button>
      </div>

      <div className="flex items-center gap-1 mb-4 overflow-x-auto hide-scrollbar">
        <Tab active={activeTab === "songs"} icon={BsMusicNoteBeamed} label="Songs" onClick={() => setActiveTab("songs")} />
        <Tab active={activeTab === "artists"} icon={BsPeopleFill} label="Artists" onClick={() => setActiveTab("artists")} />
        <Tab active={activeTab === "albums"} icon={BsDisc} label="Albums" onClick={() => setActiveTab("albums")} />
      </div>

      {activeTab === "songs" && <SongsTab />}
      {activeTab === "artists" && <ArtistsTab />}
      {activeTab === "albums" && <AlbumsTab />}
    </div>
  );
};

export default AdminDashboard;
