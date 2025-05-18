import Router from "./router";
import { ListProvider } from "./context/ListContext";

function App() {
  return (
    <ListProvider>
      <Router />
    </ListProvider>
  );
}

export default App;
