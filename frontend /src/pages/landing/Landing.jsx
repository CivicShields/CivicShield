import { useNavigate } from "react-router-dom";
import styles from "./Landing.module.css";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import rocketIcon from "../../assets/rocket.png";
import verifiedIcon from "../../assets/verified.png";
import secureIcon from "../../assets/secure.png";
import Button from "../../utilities/Button";
import Card from "../../components/card/Card";

function Landing() {
  const navigate = useNavigate();

  function handleViewButton() {
    navigate("/map");
  }

  function handleReportButton() {
    navigate("/report");
  }

  const card_details = {
    fastResponse: {
      icon: rocketIcon,
      title: "Fast Response",
      content: "Fast Response on services for rocket response",
    },
    verifiedDepart: {
      icon: verifiedIcon,
      title: "Verified Departments",
      content: "Secure communication with verified departments",
    },
    privacy: {
      icon: secureIcon,
      title: "Secure & Private",
      content: "Secure and private communication is our motto",
    },
  };

  return (
    <>
      <Header />
      <main className={styles.landing}>
        <section className={styles.upperSection}>
          <div className={styles.contentBox}>
            <p className={styles.p2}>
              Report an incident in seconds. Help arrives faster
            </p>
            <p className={styles.p1}>
              Please provide as much details as possible. All fields are
              required to be filled
            </p>
            <div className={styles.contentBoxButtons}>
              <Button
                name="Report an incident"
                classStyle={styles.within1}
                onClick={handleReportButton}
              />
              <Button
                name="View live map"
                classStyle={styles.within2}
                onClick={handleViewButton}
              />
            </div>
          </div>
        </section>

        <section className={styles.middleSection}>
          <p className={styles.section2Heading}>Why SafetyTrack</p>
          <div className={styles.contentBox2}>
            <Card
              imageUrl={card_details.fastResponse.icon}
              name={card_details.fastResponse.title}
              content={card_details.fastResponse.content}
            />
            <Card
              imageUrl={card_details.verifiedDepart.icon}
              name={card_details.verifiedDepart.title}
              content={card_details.verifiedDepart.content}
            />
            <Card
              imageUrl={card_details.privacy.icon}
              name={card_details.privacy.title}
              content={card_details.privacy.content}
            />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Landing;
