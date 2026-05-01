import { Link } from "react-router-dom";
import Button from "../../utilities/Button";
import styles from "./NotFound.module.css";
import { TriangleAlert } from "lucide-react";

function NotFound() {
  return (
    <>
      <main className={styles.container}>
        <div>
          <TriangleAlert color="red" size={150} />
          <h3>ERROR</h3>
          <h2>PAGE NOT FOUND</h2>
          <p>click button to go back to landing page</p>
          <Link to="/" className={styles.return}>
            Back
          </Link>
        </div>
      </main>
    </>
  );
}

export default NotFound;
