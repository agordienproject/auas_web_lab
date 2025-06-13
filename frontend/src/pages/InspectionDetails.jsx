import { useState, useEffect, useCallback } from 'react';
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
import { inspectionService } from '../services';

export default function InspectionDetails() {
  const { id } = useParams();
  const [inspection, setInspection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedInspection, setEditedInspection] = useState(null);

  const fetchInspectionDetails = useCallback(async () => {
    try {
      // Use inspectionService instead of direct fetch
      const data = await inspectionService.getInspectionById(id);
      setInspection(data);
      setEditedInspection(data);
    } catch (err) {
      setError(err.message || 'Failed to load inspection details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchInspectionDetails();
  }, [fetchInspectionDetails]);

  const handleSaveChanges = async () => {
    setSaving(true);
    setError(null);
    
    try {
      // Use inspectionService instead of direct fetch
      const updatedInspection = await inspectionService.updateInspection(id, editedInspection);
      setInspection(updatedInspection);
      setIsEditing(false);
    } catch (err) {
      setError(err.message || 'Failed to update inspection');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedInspection(inspection);
    setIsEditing(false);
    setError(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading inspection details...</div>
      </div>
    );
  }

  if (error && !inspection) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600 text-lg">{error}</div>
      </div>
    );
  }

  if (!inspection) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Inspection not found</div>
      </div>
    );
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
            <Button 
              variant="secondary" 
              onClick={handleCancelEdit}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveChanges}
              loading={saving}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="text-red-600 text-sm">{error}</div>
        </div>
      )}

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
                    checked={editedInspection.dents || false}
                    onChange={(e) => setEditedInspection({
                      ...editedInspection,
                      dents: e.target.checked
                    })}
                    disabled={saving}
                  />
                  <Text>Dents</Text>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editedInspection.corrosions || false}
                    onChange={(e) => setEditedInspection({
                      ...editedInspection,
                      corrosions: e.target.checked
                    })}
                    disabled={saving}
                  />
                  <Text>Corrosion</Text>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editedInspection.scratches || false}
                    onChange={(e) => setEditedInspection({
                      ...editedInspection,
                      scratches: e.target.checked
                    })}
                    disabled={saving}
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
              value={editedInspection.notes || ''}
              onChange={(e) => setEditedInspection({
                ...editedInspection,
                notes: e.target.value
              })}
              rows={4}
              disabled={saving}
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
                <img
                  key={index}
                  src={image}
                  alt={`Inspection ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
              ))}
            </div>
          </Card>
        )}
      </Grid>
    </main>
  );
} 