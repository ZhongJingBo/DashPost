const Categories = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          New Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Technology</h2>
            <div>
              <button className="text-blue-500 hover:text-blue-700 mr-2">Edit</button>
              <button className="text-red-500 hover:text-red-700">Delete</button>
            </div>
          </div>
          <p className="text-gray-600 mt-2">Posts: 0</p>
        </div>
      </div>
    </div>
  );
};

export default Categories; 