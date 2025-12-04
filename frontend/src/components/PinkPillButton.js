import "../styles/PinkPillButton.css";

function PinkPillButton({ icon, onClick }) {
  return (
    <button className="pill-btn" onClick={onClick}>
      {icon}
    </button>
  );
}

export default PinkPillButton;
