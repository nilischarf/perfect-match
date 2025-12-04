import "../styles/DeleteButton.css";

function DeleteButton({ onClick }) {
  return (
    <button className="delete-btn" onClick={onClick}>
      🗑️
    </button>
  );
}

export default DeleteButton;
