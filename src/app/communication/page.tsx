export default function CommunicationPage() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">Messages</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          {/* Conversation list sidebar */}
        </div>
        <div className="lg:col-span-2">
          {/* Active conversation */}
        </div>
      </div>
    </div>
  );
}
