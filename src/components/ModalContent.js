import { useState } from 'react';
import ModalCard from './ModalCard';
import ModalForm from './ModalForm';

const ModalContent = ({ data, onSave, onCancel, onDelete, onAdd }) => {
  const isEditing = Object.keys(data).length > 0;
  const [view, setView] = useState(isEditing ? 'card' : 'form');

  const views = {
    card: (
      <ModalCard
        data={data}
        onEdit={() => setView('form')}
        onCancel={onCancel}
        onDelete={onDelete}
      />
    ),
    form: (
      <ModalForm
        data={data}
        onSave={isEditing ? onSave : onAdd}
        onBack={isEditing ? () => setView('card') : onCancel}
      />
    )
  };

  return views[view];
};
export default ModalContent;
