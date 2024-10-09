import { Welcome } from '../components/Welcome/Welcome';
import { Nav } from '../components/Nav/Nav';
import '../App.css';

export function Home() {
  return (
    <div className="app-container">
      <Nav />
      <div className="content-container">
        <Welcome />
      </div>
    </div>
  );
}