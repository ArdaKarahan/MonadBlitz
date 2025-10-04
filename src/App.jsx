import "./index.css";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
      <div className="bg-white p-10 rounded-2xl shadow-2xl">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          🎉 Tailwind Çalışıyor!
        </h1>
        <p className="text-gray-600 text-lg">
          Eğer bunu görüyorsan, kurulum başarılı!
        </p>
        <button className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105">
          Tıkla Bana
        </button>
      </div>
    </div>
  );
}

export default App;
