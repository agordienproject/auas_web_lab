import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Title,
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Badge,
  Button,
  TextInput,
  Select,
  SelectItem,
} from '@tremor/react';

export default function ValidationQueue() {
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('pending');
  const navigate = useNavigate();

  useEffect(() => {
    fetchInspections();
  }, [filterStatus]);

  const fetchInspections = async () => {
    try {
      // Replace with your actual API endpoint
      const response = await fetch(`/api/inspections?status=${filterStatus}`);
      if (!response.ok) {
        throw new Error('Failed to fetch inspections');
      }
      const data = await response.json();
      setInspections(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load inspections');
      setLoading(false);
    }
  };

  const handleValidate = async (inspectionId) => {
    try {
      // Replace with your actual API endpoint
      const response = await fetch(`/api/inspections/${inspectionId}/validate`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to validate inspection');
      }

      // Refresh the list
      fetchInspections();
    } catch (err) {
      setError('Failed to validate inspection');
    }
  };

  const handleReject = async (inspectionId) => {
    if (!window.confirm('Are you sure you want to reject this inspection?')) {
      return;
    }

    try {
      // Replace with your actual API endpoint
      const response = await fetch(`/api/inspections/${inspectionId}/reject`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to reject inspection');
      }

      // Refresh the list
      fetchInspections();
    } catch (err) {
      setError('Failed to reject inspection');
    }
  };

  const filteredInspections = inspections.filter(inspection =>
    inspection.ref_piece.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inspection.inspector_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <Title>Validation Queue</Title>

      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        <TextInput
          className="max-w-xs"
          placeholder="Search by reference or inspector..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select
          className="max-w-xs"
          value={filterStatus}
          onValueChange={setFilterStatus}
        >
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="validated">Validated</SelectItem>
          <SelectItem value="rejected">Rejected</SelectItem>
        </Select>
      </div>

      {error && (
        <div className="text-red-600 text-sm mt-4">{error}</div>
      )}

      <Card className="mt-6">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Reference</TableHeaderCell>
              <TableHeaderCell>Inspector</TableHeaderCell>
              <TableHeaderCell>Date</TableHeaderCell>
              <TableHeaderCell>Issues</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredInspections.map((inspection) => (
              <TableRow key={inspection.id}>
                <TableCell>{inspection.ref_piece}</TableCell>
                <TableCell>{inspection.inspector_name}</TableCell>
                <TableCell>
                  {new Date(inspection.inspection_date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {inspection.dents && <Badge color="red">Dents</Badge>}
                    {inspection.corrosions && <Badge color="red">Corrosion</Badge>}
                    {inspection.scratches && <Badge color="red">Scratches</Badge>}
                    {!inspection.dents && !inspection.corrosions && !inspection.scratches && (
                      <Badge color="emerald">No Issues</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    color={
                      inspection.inspection_validated ? 'emerald' :
                      inspection.rejected ? 'red' :
                      'yellow'
                    }
                  >
                    {inspection.inspection_validated ? 'Validated' :
                     inspection.rejected ? 'Rejected' :
                     'Pending'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="xs"
                      onClick={() => navigate(`/inspections/${inspection.id}`)}
                    >
                      View
                    </Button>
                    {!inspection.inspection_validated && !inspection.rejected && (
                      <>
                        <Button
                          size="xs"
                          color="emerald"
                          onClick={() => handleValidate(inspection.id)}
                        >
                          Validate
                        </Button>
                        <Button
                          size="xs"
                          color="red"
                          onClick={() => handleReject(inspection.id)}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </main>
  );
} 