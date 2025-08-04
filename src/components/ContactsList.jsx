export default function ContactsList({ contacts, onSelectContact }) {
  return (
    <div className="w-64 bg-gray-100 border-l p-4 overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4">Contatos</h2>
      {contacts.map((contact) => (
        <button
          key={contact.id}
          onClick={() => onSelectContact({ ...contact, type: "private" })}
          className="w-full text-gray-800 text-left p-2 hover:bg-gray-200 rounded mb-1"
        >
          {contact.name_user}
        </button>
      ))}
    </div>
  );
}
