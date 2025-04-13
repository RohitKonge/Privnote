import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Trash2, PlusCircle } from 'lucide-react';

function NoteDestroyed() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const reason = searchParams.get('reason') || 'read';

  // Message based on destruction reason
  const getDestructionMessage = () => {
    switch (reason) {
      case 'expired':
        return 'This note has reached its expiration time and has been permanently destroyed.';
      case 'read':
      default:
        return 'This note has been read and has been permanently destroyed.';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 text-center">
      <Trash2 className="w-16 h-16 text-red-500 mx-auto mb-6" />
      
      <h2 className="text-2xl font-bold mb-4">Note Destroyed</h2>
      <p className="text-gray-600 mb-8">
        {getDestructionMessage()}
        <br />
        If you need to share another note, please create a new one.
      </p>

      <Link
        to="/"
        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
      >
        <PlusCircle className="w-4 h-4" />
        Create New Private Note
      </Link>
    </div>
  );
}

export default NoteDestroyed;