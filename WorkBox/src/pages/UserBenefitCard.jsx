import React, { useState } from 'react';
import axios from 'axios';
import BenefitEditRow from '../components/finance/BenefitEditRow';
import '../styles/UserBenefitCard.css';

const UserBenefitCard = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [benefits, setBenefits] = useState(user.benefits);
  const [originalBenefits, setOriginalBenefits] = useState(user.benefits);
  const [deletedIds, setDeletedIds] = useState([]);
  const [message, setMessage] = useState('');

  // Funkcija za promjenu polja
  const handleFieldChange = (index, field, value) => {
    const updated = [...benefits];
    updated[index] = { ...updated[index], [field]: value };
    setBenefits(updated);
  };

  // Funkcija za brisanje benefita
  const handleDelete = (id) => {
    setDeletedIds([...deletedIds, id]);
    setBenefits(benefits.filter(b => b.employeeBenefitId !== id));
  };

  // Funkcija za provjeru promjena
  const hasChanges = () => {
    if (deletedIds.length > 0) return true;
    if (benefits.length !== originalBenefits.length - deletedIds.length) return true;

    return benefits.some(b => {
      const original = originalBenefits.find(o => o.employeeBenefitId === b.employeeBenefitId);
      if (!original) return true;
      return (
        original.type !== b.type ||
        original.status !== b.status ||
        original.details !== b.details
      );
    });
  };

  // Funkcija za validaciju
  const validateFields = () => {
    return benefits.every(b => b.type && b.status); // Provjeravamo da su oba polja ispunjena
  };

  // Funkcija za ažuriranje podataka
  const handleUpdate = async () => {
    if (!validateFields()) {
      setMessage('Type and status must be filled in.');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    if (!hasChanges()) return;

    try {
      // Briši obrisane
      await Promise.all(deletedIds.map(id => axios.delete(`http://localhost:8080/finance/employee_benefit/${id}`)));

      // Ažuriraj izmjene
      await Promise.all(
        benefits.map(async (b) => {
          const original = originalBenefits.find(o => o.employeeBenefitId === b.employeeBenefitId);
          const isModified =
            !original ||
            original.type !== b.type ||
            original.status !== b.status ||
            original.details !== b.details;

          if (isModified) {
            await axios.put(`http://localhost:8080/finance/employee_benefit/${b.employeeBenefitId}`, {
              ...b,
              user: {
                userId: user.userId,
                firstName: user.firstName,
                lastName: user.lastName,
              },
            });
          }
        })
      );

      setOriginalBenefits(benefits);
      setDeletedIds([]);
      setIsEditing(false);
      setMessage('Updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('An error occurred while updating.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  // Funkcija za otkazivanje izmjena
  const handleCancel = () => {
    setBenefits(originalBenefits);
    setDeletedIds([]);
    setIsEditing(false);
    setMessage('');
  };

  return (
    <div className="col-12 mb-4">
      <div className="user-benefit-card">
        <div className="user-benefit-header">
          <h5 className="user-benefit-header-text">
            {user.firstName} {user.lastName}
          </h5>
        </div>

        <div className="user-benefit-body">
          {benefits.map((benefit, index) =>
            isEditing ? (
              <BenefitEditRow
                key={benefit.employeeBenefitId}
                benefit={benefit}
                index={index}
                onChange={handleFieldChange}
                onDelete={handleDelete}
              />
            ) : (
              <div key={benefit.employeeBenefitId} className="benefit-row">
                <div><strong>Type:</strong> {benefit.type}</div>
                <div><strong>Status:</strong> {benefit.status}</div>
                <div><strong>Details:</strong><br /> {benefit.details}</div>
              </div>
            )
          )}
        </div>

        <div className="user-benefit-footer">
          {isEditing ? (
            <>
              <button
                className="btn btn-success btn-sm user-benefit-button"
                onClick={handleUpdate}
                disabled={!hasChanges()}
              >
                Save changes
              </button>
              <button
                className="btn btn-secondary btn-sm user-benefit-button"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              className="btn btn-info btn-sm user-benefit-button"
              onClick={() => {
                setIsEditing(true);
                setOriginalBenefits(benefits);
              }}
            >
              Update
            </button>
          )}
        </div>

        {message && <div className="update-message">{message}</div>}
      </div>
    </div>
  );
};

export default UserBenefitCard;
