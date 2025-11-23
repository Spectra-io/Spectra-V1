'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import type { PersonalInfo } from '@spectra/shared';

interface PersonalInfoProps {
  onComplete: (data: PersonalInfo) => void;
}

export function PersonalInfoForm({ onComplete }: PersonalInfoProps) {
  const [formData, setFormData] = useState<PersonalInfo>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    nationality: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
    },
    documentType: 'passport',
    documentNumber: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.nationality.trim()) newErrors.nationality = 'Nationality is required';
    if (!formData.documentNumber.trim()) newErrors.documentNumber = 'Document number is required';
    if (!formData.address.street.trim()) newErrors['address.street'] = 'Street is required';
    if (!formData.address.city.trim()) newErrors['address.city'] = 'City is required';
    if (!formData.address.country.trim()) newErrors['address.country'] = 'Country is required';
    if (!formData.address.postalCode.trim())
      newErrors['address.postalCode'] = 'Postal code is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validate()) {
      onComplete(formData);
    }
  };

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-2xl font-semibold mb-2">Personal Information</h3>
        <p className="text-gray-600">Please provide your personal details accurately</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="John"
              className={errors.firstName ? 'border-red-500' : ''}
            />
            {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
          </div>

          <div>
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Doe"
              className={errors.lastName ? 'border-red-500' : ''}
            />
            {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
          </div>
        </div>

        {/* Date of Birth */}
        <div>
          <Label htmlFor="dateOfBirth">Date of Birth *</Label>
          <Input
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className={errors.dateOfBirth ? 'border-red-500' : ''}
          />
          {errors.dateOfBirth && (
            <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>
          )}
        </div>

        {/* Nationality */}
        <div>
          <Label htmlFor="nationality">Nationality *</Label>
          <Input
            id="nationality"
            name="nationality"
            value={formData.nationality}
            onChange={handleChange}
            placeholder="e.g., United States"
            className={errors.nationality ? 'border-red-500' : ''}
          />
          {errors.nationality && (
            <p className="text-red-500 text-sm mt-1">{errors.nationality}</p>
          )}
        </div>

        {/* Document Type */}
        <div>
          <Label htmlFor="documentType">Document Type *</Label>
          <select
            id="documentType"
            name="documentType"
            value={formData.documentType}
            onChange={handleChange}
            className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          >
            <option value="passport">Passport</option>
            <option value="driver_license">Driver&apos;s License</option>
            <option value="national_id">National ID</option>
          </select>
        </div>

        {/* Document Number */}
        <div>
          <Label htmlFor="documentNumber">Document Number *</Label>
          <Input
            id="documentNumber"
            name="documentNumber"
            value={formData.documentNumber}
            onChange={handleChange}
            placeholder="Document number"
            className={errors.documentNumber ? 'border-red-500' : ''}
          />
          {errors.documentNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.documentNumber}</p>
          )}
        </div>

        {/* Address Section */}
        <div className="pt-4 border-t">
          <h4 className="font-semibold mb-4">Address</h4>

          <div className="space-y-4">
            <div>
              <Label htmlFor="address.street">Street Address *</Label>
              <Input
                id="address.street"
                name="address.street"
                value={formData.address.street}
                onChange={handleChange}
                placeholder="123 Main Street"
                className={errors['address.street'] ? 'border-red-500' : ''}
              />
              {errors['address.street'] && (
                <p className="text-red-500 text-sm mt-1">{errors['address.street']}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="address.city">City *</Label>
                <Input
                  id="address.city"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleChange}
                  placeholder="New York"
                  className={errors['address.city'] ? 'border-red-500' : ''}
                />
                {errors['address.city'] && (
                  <p className="text-red-500 text-sm mt-1">{errors['address.city']}</p>
                )}
              </div>

              <div>
                <Label htmlFor="address.state">State / Province</Label>
                <Input
                  id="address.state"
                  name="address.state"
                  value={formData.address.state}
                  onChange={handleChange}
                  placeholder="NY"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="address.country">Country *</Label>
                <Input
                  id="address.country"
                  name="address.country"
                  value={formData.address.country}
                  onChange={handleChange}
                  placeholder="United States"
                  className={errors['address.country'] ? 'border-red-500' : ''}
                />
                {errors['address.country'] && (
                  <p className="text-red-500 text-sm mt-1">{errors['address.country']}</p>
                )}
              </div>

              <div>
                <Label htmlFor="address.postalCode">Postal Code *</Label>
                <Input
                  id="address.postalCode"
                  name="address.postalCode"
                  value={formData.address.postalCode}
                  onChange={handleChange}
                  placeholder="10001"
                  className={errors['address.postalCode'] ? 'border-red-500' : ''}
                />
                {errors['address.postalCode'] && (
                  <p className="text-red-500 text-sm mt-1">{errors['address.postalCode']}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-6">
          <Button type="submit" className="w-full bg-primary-500 hover:bg-primary-600 py-6">
            Continue
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </form>
    </Card>
  );
}
