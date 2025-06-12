import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Card,
  Title,
  Text,
  Grid,
  Col,
  Metric,
  Badge,
  Button,
  TextInput,
  Textarea,
} from '@tremor/react';

export default function InspectionDetails() {
  const { id } = useParams();
  const [inspection, setInspection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedInspection, setEditedInspection] = useState(null);

  useEffect(() => {
    fetchInspectionDetails();
  }, [id]);

  const fetchInspectionDetails = async () => {
    try {
      // Replace with your actual API endpoint
      const response = await fetch(`/api/inspections/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch inspection details');
      }
      const data = await response.json();
      setInspection(data);
      setEditedInspection(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load inspection details');
      setLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    try {
      // Replace with your actual API endpoint
      const response = await fetch(`/api/inspections/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedInspection),
      });

      if (!response.ok) {
        throw new Error('Failed to update inspection');
      }

      const updatedInspection = await response.json();
      setInspection(updatedInspection);
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update inspection');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Title>Inspection Details</Title>
          <Text>Reference: {inspection.ref_piece}</Text>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>
            Edit Inspection
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveChanges}>
              Save Changes
            </Button>
          </div>
        )}
      </div>

      <Grid numItemsMd={2} numItemsLg={3} className="gap-6">
        <Card>
          <Title>Status</Title>
          <div className="mt-4">
            <Badge color={inspection.inspection_validated ? 'emerald' : 'yellow'}>
              {inspection.inspection_validated ? 'Validated' : 'Pending Validation'}
            </Badge>
          </div>
          {inspection.inspection_validated && (
            <Text className="mt-2">
              Validated by: {inspection.validated_by}
              <br />
              Validation Date: {new Date(inspection.validation_date).toLocaleDateString()}
            </Text>
          )}
        </Card>

        <Card>
          <Title>Inspector Information</Title>
          <Text className="mt-2">
            Name: {inspection.inspector_name}
            <br />
            Date: {new Date(inspection.inspection_date).toLocaleDateString()}
          </Text>
        </Card>

        <Card>
          <Title>Issues Found</Title>
          <div className="mt-4 space-y-2">
            {isEditing ? (
              <>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editedInspection.dents}
                    onChange={(e) => setEditedInspection({
                      ...editedInspection,
                      dents: e.target.checked
                    })}
                  />
                  <Text>Dents</Text>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editedInspection.corrosions}
                    onChange={(e) => setEditedInspection({
                      ...editedInspection,
                      corrosions: e.target.checked
                    })}
                  />
                  <Text>Corrosion</Text>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editedInspection.scratches}
                    onChange={(e) => setEditedInspection({
                      ...editedInspection,
                      scratches: e.target.checked
                    })}
                  />
                  <Text>Scratches</Text>
                </div>
              </>
            ) : (
              <>
                {inspection.dents && <Badge color="red">Dents</Badge>}
                {inspection.corrosions && <Badge color="red">Corrosion</Badge>}
                {inspection.scratches && <Badge color="red">Scratches</Badge>}
                {!inspection.dents && !inspection.corrosions && !inspection.scratches && (
                  <Text>No issues found</Text>
                )}
              </>
            )}
          </div>
        </Card>

        <Card className="col-span-full">
          <Title>Notes</Title>
          {isEditing ? (
            <Textarea
              className="mt-2"
              value={editedInspection.notes}
              onChange={(e) => setEditedInspection({
                ...editedInspection,
                notes: e.target.value
              })}
              rows={4}
            />
          ) : (
            <Text className="mt-2 whitespace-pre-wrap">
              {inspection.notes || 'No notes provided'}
            </Text>
          )}
        </Card>

        {inspection.images && inspection.images.length > 0 && (
          <Card className="col-span-full">
            <Title>Images</Title>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {inspection.images.map((image, index) => (
                <div key={index} className="aspect-square">
                  <img
                    src={image.url}
                    alt={`Inspection image ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          </Card>
        )}
      </Grid>
    </main>
  );
} 