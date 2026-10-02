
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";

const App = () => {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get todos from Supabase
  const getTodos = async () => {
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      alert(error.message);
    } else {
      setTodos(data);
    }

    setLoading(false);
  };

  useEffect(() => {
    getTodos();
  }, []);

  // Add todo
  const addTodo = async (e) => {
    e.preventDefault();

    if (!todo.trim()) return;

    const { data, error } = await supabase
      .from("todos")
      .insert([{ title: todo.trim() }])
      .select();

    if (error) {
      alert(error.message);
      return;
    }

    setTodos((prev) => [...data, ...prev]);
    setTodo("");
  };

  // Delete todo
  const deleteTodo = async (id) => {
    const { error } = await supabase
      .from("todos")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    setTodos((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  // Complete todo
  const toggleTodo = async (item) => {
    const { error } = await supabase
      .from("todos")
      .update({ completed: !item.completed })
      .eq("id", item.id);

    if (error) {
      alert(error.message);
      return;
    }

    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === item.id
          ? { ...todo, completed: !item.completed }
          : todo
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">

        <h1 className="text-3xl font-bold text-center mb-6">
          Todo List
        </h1>

        <form onSubmit={addTodo} className="flex gap-2 mb-6">
          <input
            type="text"
            value={todo}
            onChange={(e) => setTodo(e.target.value)}
            placeholder="Enter your todo..."
            className="flex-1 border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 rounded-lg hover:bg-blue-600"
          >
            Add
          </button>
        </form>

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : todos.length === 0 ? (
          <p className="text-center text-gray-500">
            No todos yet!
          </p>
        ) : (
          <ul className="space-y-3">
            {todos.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-3 border p-3 rounded-lg"
              >
                <label className="flex items-center gap-3 flex-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => toggleTodo(item)}
                  />

                  <span
                    className={
                      item.completed
                        ? "line-through text-gray-400"
                        : ""
                    }
                  >
                    {item.title}
                  </span>
                </label>

                <button
                  onClick={() => deleteTodo(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}

      </div>
    </div>
  );
};

export default App;