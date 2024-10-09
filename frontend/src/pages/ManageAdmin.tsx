import { Nav } from '../components/Nav/Nav';
import { AdminTable } from '../components/AdminTable/AdminTable';
import '../App.css';

export function ManageAdmin() {
  return (
    <div className="app-container">
      <Nav />
      <div className="content-container">
        <div>
          <h1>Manage Users</h1>
          <p>Here you can manage users</p>
        </div>
        <AdminTable />
      </div>
    </div>
  );
}
