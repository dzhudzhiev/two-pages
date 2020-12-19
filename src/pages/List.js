import React, { useState, useEffect } from 'react';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import Modal from 'react-modal';
import { v4 as uuidv4 } from 'uuid';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import styled from 'styled-components';
import Header from '../components/Header';
import ModalContent from '../components/ModalContent';

const Button = styled.button`
  padding: 5px 30px;
  margin-top: 5px;
`;

Modal.setAppElement('#root');

const List = () => {
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [rowData, setRowData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [data, setData] = useState({});

  function openModal(data) {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  function saveRow(formData) {
    selectedRow.setData(formData);
    closeModal();
  }

  function removeRow(formData) {
    setRowData(prev => prev.filter(({ id }) => id !== data.id));
    closeModal();
  }

  function addRow(formData) {
    setRowData([...rowData, { ...formData, id: uuidv4() }]);
    closeModal();
  }

  function handleAdd() {
    setData({});
    openModal();
  }

  useEffect(() => {
    fetch(
      'https://randomuser.me/api/?nat=gb,de,us&inc=name,location,email,picture&results=5'
    )
      .then(res => res.json())
      .then(({ results }) => {
        const data = results.map(item => ({
          id: item.email,
          name: `${item.name.first} ${item.name.last}`,
          country: item.location.country,
          city: item.location.city,
          picture: item.picture.large
        }));
        setRowData(data);
      });
  }, []);

  const ImageRenderer = props => {
    return <img src={props.value} alt="user" style={{ width: '40px' }} />;
  };

  return (
    <>
      <Header dest={{ to: '/weather', label: 'To The Weather' }} />
      <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
        <AgGridReact
          rowData={rowData}
          rowSelection="single"
          onRowSelected={event => {
            if (event.node.selected) {
              setSelectedRow(event.node);
            }
          }}
          onRowClicked={event => {
            setData(event.node.data);
            openModal(event.node.data);
          }}
          frameworkComponents={{
            imageRenderer: ImageRenderer
          }}
        >
          <AgGridColumn
            field="picture"
            cellRenderer="imageRenderer"
            width={98}
          ></AgGridColumn>
          <AgGridColumn
            field="name"
            sortable={true}
            filter={true}
            width={200}
          ></AgGridColumn>
          <AgGridColumn
            field="country"
            sortable={true}
            filter={true}
            width={200}
          ></AgGridColumn>
          <AgGridColumn
            field="city"
            sortable={true}
            filter={true}
            width={200}
          ></AgGridColumn>
        </AgGridReact>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={{
            content: {
              top: '50px',
              left: '50%',
              bottom: 'auto',
              width: '400px',
              transform: 'translateX(-50%)'
            }
          }}
        >
          <ModalContent
            data={data}
            onSave={saveRow}
            onCancel={closeModal}
            onDelete={removeRow}
            onAdd={addRow}
          />
        </Modal>
      </div>
      <Button onClick={handleAdd}>New User</Button>
    </>
  );
};

export default List;
