import { useState, useEffect, useCallback } from 'react';
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
import { inspectionService } from '../services';

export default function ValidationQueue() {
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('pending');
  const navigate = useNavigate();

  const fetchInspections = useCallback(async () => {
    try {
      // Use inspectionService instead of direct fetch
      const data = await inspectionService.getInspections({ status: filterStatus });
      setInspections(data);
    } catch (err) {
      setError(err.message || 'Failed to load inspections');
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    fetchInspections();
  }, [fetchInspections]);

  const handleValidate = async (inspectionId) => {
    setValidating(true);
    setError(null);
    
    try {
      // Use inspectionService instead of direct fetch
      await inspectionService.validateInspection(inspectionId, { 
        validated: true,
        validationDate: new Date().toISOString()
      });

      // Refresh the list
      await fetchInspections();
    } catch (err) {
      setError(err.message || 'Failed to validate inspection');
    } finally {
      setValidating(false);
    }
  };

  const handleReject = async (inspectionId) => {
    if (!window.confirm('Are you sure you want to reject this inspection?')) {
      return;
    }

    setValidating(true);
    setError(null);

    try {
      // Use inspectionService instead of direct fetch
      await inspectionService.validateInspection(inspectionId, { 
        validated: false,
        rejected: true,
        rejectionDate: new Date().toISOString()
      });

      // Refresh the list
      await fetchInspections();
    } catch (err) {
      setError(err.message || 'Failed to reject inspection');
    } finally {
      setValidating(false);
    }
  };

  const filteredInspections = inspections.filter(inspection =>
    inspection.ref_piece?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inspection.inspector_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading validation queue...</div>
      </div>
    );
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
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="text-red-600 text-sm">{error}</div>
        </div>
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
            {filteredInspections.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No inspections found
                </TableCell>
              </TableRow>
            ) : (
              filteredInspections.map((inspection) => (
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
                        onClick={() => navigate(`/inspection/${inspection.id}`)}
                        disabled={validating}
                      >
                        View
                      </Button>
                      {!inspection.inspection_validated && !inspection.rejected && (
                        <>
                          <Button
                            size="xs"
                            color="emerald"
                            onClick={() => handleValidate(inspection.id)}
                            loading={validating}
                            disabled={validating}
                          >
                            {validating ? 'Validating...' : 'Validate'}
                          </Button>
                          <Button
                            size="xs"
                            color="red"
                            onClick={() => handleReject(inspection.id)}
                            loading={validating}
                            disabled={validating}
                          >
                            {validating ? 'Rejecting...' : 'Reject'}
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </main>
  );
} 