export default function GroupsList({ groups, onSelectGroup }) {
  return (
    <div className="w-64 bg-gray-800 text-blue-300 p-4 overflow-y-auto">
      <h2 className="text-white text-xl font-semibold mb-4">Grupos</h2>
      {groups.map((group) => (
        <button
          key={group.id}
          onClick={() => onSelectGroup({ ...group, type: "group" })}
          className="w-full text-gray-800 text-left p-2 hover:bg-gray-700 rounded mb-1"
        >
          {group.name}
        </button>
      ))}
    </div>
  );
}
