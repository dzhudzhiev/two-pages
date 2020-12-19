import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import styled from 'styled-components';

const StyledForm = styled.form`
  img {
    height: 150px;
    margin-bottom: 20px;
  }

  .form-group {
    margin-bottom: 10px;
  }

  input {
    width: 100%;
    padding: 5px;
  }

  .button-group {
    display: flex;

    button {
      margin-right: 10px;
      padding: 5px 10px;
    }
  }
`;

const ModalForm = ({ data, onSave, onBack }) => {
  const [profileImage, setProfileImage] = useState(data?.picture);
  const { register, handleSubmit, control, errors } = useForm({
    defaultValues: data
  });
  const onSubmit = data => {
    if (profileImage !== data.picture) {
      data.picture = profileImage;
    }
    onSave(data);
  };

  const required = 'This field is required';

  const errorMessage = error => {
    return <div>{error}</div>;
  };

  return (
    <StyledForm onSubmit={handleSubmit(onSubmit)}>
      {profileImage && <img src={profileImage} alt="user" />}
      <div className="form-group">
        <Controller
          control={control}
          name="picture"
          rules={{ required: true }}
          render={({ onChange }) => (
            <input
              type="file"
              accept="image/*"
              onChange={e => {
                const reader = new FileReader();
                reader.onload = () => {
                  if (reader.readyState === 2) {
                    setProfileImage(reader.result);
                  }
                };
                reader.readAsDataURL(e.target.files[0]);
                onChange(e);
              }}
            />
          )}
        />
        {errors.picture &&
          errors.picture.type === 'required' &&
          errorMessage(required)}
      </div>
      <div className="form-group">
        <input
          type="text"
          placeholder="Name"
          name="name"
          ref={register({ required: true })}
        />
        {errors.name &&
          errors.name.type === 'required' &&
          errorMessage(required)}
      </div>
      <div className="form-group">
        <input
          type="text"
          placeholder="Country"
          name="country"
          ref={register({ required: true })}
        />
        {errors.country &&
          errors.country.type === 'required' &&
          errorMessage(required)}
      </div>
      <div className="form-group">
        <input
          type="text"
          placeholder="City"
          name="city"
          ref={register({ required: true })}
        />
        {errors.city &&
          errors.city.type === 'required' &&
          errorMessage(required)}
      </div>
      <div className="button-group">
        <button type="submit">Save</button>
        <button
          type="button"
          onClick={() => {
            setProfileImage(data.picture);
            onBack();
          }}
        >
          Cancel
        </button>
      </div>
    </StyledForm>
  );
};

export default ModalForm;
