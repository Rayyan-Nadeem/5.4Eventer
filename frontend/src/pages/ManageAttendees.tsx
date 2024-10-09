import { Nav } from '../components/Nav/Nav';
import { UsersTable } from '../components/UsersTable/UsersTable';
import '../App.css';
  
export function ManageAttendees() {
  return (
    <div className="app-container">
      <Nav/>
      <div className="content-container">
        <div>
          <h1>Manage Attendees</h1>
          <h2>Add a Search bar here</h2>
        </div>
        <UsersTable/>
      </div>
    </div>
  );
}