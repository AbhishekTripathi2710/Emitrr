export default function UsernameForm({ onSubmit }) {
  let username = "";

  return (
    <div className="flex gap-2 mb-6">
      <input
        className="border px-3 py-2 rounded w-64"
        placeholder="Enter username"
        onChange={(e) => (username = e.target.value)}
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={() => onSubmit(username)}
      >
        Play
      </button>
    </div>
  );
}
