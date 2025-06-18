import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState, useEffect } from "react";
import * as yup from "yup";
import Select from 'react-select';

const ConditionOptions = [
  { value: 'Full-time', label: 'Full-time' },
  { value: 'Part-time', label: 'Part-time' },
  { value: 'Flexible working hours', label: 'Flexible working hours' },
  { value: 'On-site', label: 'On-site' },
  { value: 'Remote', label: 'Remote' },
  { value: 'Hybrid', label: 'Hybrid' },
  { value: 'Fast-paced', label: 'Fast-paced' },
  { value: 'Team-oriented', label: 'Team-oriented' },
  { value: 'Remote', label: 'Remote' },
  { value: 'Company laptop provided', label: 'Company laptop provided' }
];

const BenefitOptions = [
    { value: 'Health insurance', label: 'Health insurance' },
    { value: 'Mental health support', label: 'Mental health support' },
    { value: 'Gym membership', label: 'Gym membership' },
    { value: 'Competitive salary', label: 'Competitive salary' },
    { value: 'Transportation allowance', label: 'Transportation allowance' },
    { value: 'Paid holidays', label: 'Paid holidays' },
    { value: 'Budget for courses and certifications', label: 'Budget for courses and certifications' },
]

const schema = yup.object().shape({
  title: yup.string().required("Title is required").min(3, "Title must be at least 3 characters"),
  description: yup.string().required("Description is required").min(10, "Description must be at least 10 characters"),
  conditions: yup.array().min(1, "Select at least one condition"),
  benefits: yup.array().min(1, "Select at least one benefit"),
  startDate: yup.date().required("Start date is required"),
  endDate: yup
    .date()
    .required("End date is required")
    .min(yup.ref("startDate"), "End date can't be before start date"),
});

const OpeningForm = ({ onSubmit, defaultValues = {}, buttonLabel = "Create opening" }) => {
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [selectedBenefits, setSelectedBenefits] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    register("conditions");
    register("benefits");
  }, [register]);

  useEffect(() => {
  if (defaultValues.title) setValue("title", defaultValues.title);
  if (defaultValues.description) setValue("description", defaultValues.description);
  if (defaultValues.startDate) setValue("startDate", defaultValues.startDate.slice(0, 10));
  if (defaultValues.endDate) setValue("endDate", defaultValues.endDate.slice(0, 10));

  const conditionsMapped = defaultValues.conditions?.split(", ").map(value => ({ value, label: value })) || [];
  const benefitsMapped = defaultValues.benefits?.split(", ").map(value => ({ value, label: value })) || [];

  setSelectedConditions(conditionsMapped);
  setValue("conditions", conditionsMapped);
  setSelectedBenefits(benefitsMapped);
  setValue("benefits", benefitsMapped);
}, [defaultValues, setValue]);


  const handleConditionChange = (selected) => {
    setSelectedConditions(selected);
    setValue("conditions", selected || []);
  };

  const handleBenefitChange = (selected) => {
    setSelectedBenefits(selected);
    setValue("benefits", selected || []);
  };

  return (
    <div className="p-0">
      <div className="row justify-content-center m-0">
        <div className="col-12">
          <form
            onSubmit={handleSubmit((data) => {
              console.log("Validirani podaci:", data);
              onSubmit && onSubmit(data);
            })}
          >
            <div className="form-group row">
              <label htmlFor="title" className="col-sm-2 col-form-label">
                Title
              </label>
              <div className="col-sm-10">
                <input
                  {...register("title")}
                  type="text"
                  className={`form-control ${errors.title ? "is-invalid" : ""}`}
                  id="title"
                  placeholder="Title"
                />
                {errors.title && (
                  <div className="invalid-feedback">{errors.title.message}</div>
                )}
              </div>
            </div>

            <div className="form-group row">
              <label htmlFor="description" className="col-sm-2 col-form-label">
                Description
              </label>
              <div className="col-sm-10">
                <textarea
                  {...register("description")}
                  className={`form-control ${errors.description ? "is-invalid" : ""}`}
                  id="description"
                  rows="4"
                  placeholder="Enter description here..."
                />
                {errors.description && (
                  <div className="invalid-feedback">{errors.description.message}</div>
                )}
              </div>
            </div>

            <div className="form-group row">
              <label className="col-sm-2 col-form-label">Conditions</label>
              <div className="col-sm-10">
                <Select
                  isMulti
                  options={ConditionOptions}
                  value={selectedConditions}
                  onChange={handleConditionChange}
                  placeholder="Select conditions..."
                  className={errors.conditions ? "is-invalid" : ""}
                />
                {errors.conditions && (
                  <div className="text-danger mt-1">{errors.conditions.message}</div>
                )}
              </div>
            </div>

            <div className="form-group row">
              <label className="col-sm-2 col-form-label">Benefits</label>
              <div className="col-sm-10">
                <Select
                  isMulti
                  options={BenefitOptions}
                  value={selectedBenefits}
                  onChange={handleBenefitChange}
                  placeholder="Select benefits..."
                  className={errors.benefits ? "is-invalid" : ""}
                />
                {errors.benefits && (
                  <div className="text-danger mt-1">{errors.benefits.message}</div>
                )}
              </div>
            </div>

            <div className="form-group row">
              <label htmlFor="startDate" className="col-sm-2 col-form-label">
                Start Date
              </label>
              <div className="col-sm-10">
                <input
                  {...register("startDate")}
                  type="date"
                  className={`form-control ${errors.startDate ? "is-invalid" : ""}`}
                  id="startDate"
                />
                {errors.startDate && (
                  <div className="invalid-feedback">{errors.startDate.message}</div>
                )}
              </div>
            </div>

            <div className="form-group row">
              <label htmlFor="endDate" className="col-sm-2 col-form-label">
                End Date
              </label>
              <div className="col-sm-10">
                <input
                  {...register("endDate")}
                  type="date"
                  className={`form-control ${errors.endDate ? "is-invalid" : ""}`}
                  id="endDate"
                />
                {errors.endDate && (
                  <div className="invalid-feedback">{errors.endDate.message}</div>
                )}
              </div>
            </div>

            <div className="form-group row">
              <div className="col-sm-10">
                <button type="submit" className="btn btn-primary">
                  {buttonLabel}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OpeningForm;