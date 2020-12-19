import styled from 'styled-components';

const StyledCard = styled.div`
  img {
    height: 150px;
  }

  ul {
    margin: 0;
    list-style: none;
    padding: 20px 0;

    li {
      display: grid;
      grid-template-columns: 1fr 1fr;
      border-bottom: 1px solid #444;
      margin-bottom: 10px;
    }
  }

  .button-group {
    display: flex;

    button {
      margin-right: 10px;
      padding: 5px 10px;
    }

    .delete-button {
      margin-left: auto;
      margin-right: 0;
    }
  }
`;

const ModalCard = ({ data, onEdit, onCancel, onDelete }) => {
  return (
    <StyledCard>
      <img src={data.picture} alt="User" />
      <ul>
        <li>
          <span>Name: </span>
          {data.name}
        </li>
        <li>
          <span>Country: </span>
          {data.country}
        </li>
        <li>
          <span>City: </span>
          {data.city}
        </li>
      </ul>
      <div className="button-group">
        <button onClick={onEdit}>Edit</button>
        <button onClick={onCancel}>Cancel</button>
        <button className="delete-button" onClick={onDelete}>
          Delete
        </button>
      </div>
    </StyledCard>
  );
};

export default ModalCard;
