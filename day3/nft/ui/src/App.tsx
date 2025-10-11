import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./app/HomePage";
import AppProvider from "./AppProvider";
import { Toaster } from "sonner";
import Layout from "./components/layout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
    ],
  },
]);

function App() {
  return (
    <AppProvider>
      <RouterProvider router={router} />
      <Toaster />
    </AppProvider>
  );
}

export default App;
