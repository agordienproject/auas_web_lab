import { useEffect, useMemo, useState } from 'react';
import { Card, Title, Text, Badge, Button } from '@tremor/react';
import { ftpService } from '../services';

export default function PieceHistoryTimeline({ history = [], currentIndex = 0, onPrev, onNext }) {
  const current = history[currentIndex] || null;
  const total = history.length;
  const [images, setImages] = useState([]);
  const [imgLoading, setImgLoading] = useState(false);
  const [imgError, setImgError] = useState(null);

  const header = useMemo(() => {
    if (!current) return 'No history available';
    return `${current.name_piece || current.ref_piece} — ${current.state}`;
  }, [current]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const folder = current?.inspection_path;
      if (!folder) {
        if (mounted) { setImages([]); setImgError(null); }
        return;
      }
      setImgLoading(true);
      setImgError(null);
      try {
        const list = await ftpService.listInspectionImages(folder);
        const urls = (list || []).map(f => ({ name: f.name, url: ftpService.imageUrl(folder, f.name) }));
        if (mounted) setImages(urls);
      } catch (e) {
        if (mounted) setImgError(e.message || 'Failed to load images');
      } finally {
        if (mounted) setImgLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [current?.inspection_path]);

  return (
    <Card>
      <div className="flex items-center justify-between">
        <Title>Piece History</Title>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={onPrev} disabled={currentIndex <= 0}>◀</Button>
          <Text>{total > 0 ? `${currentIndex + 1} / ${total}` : '-'}</Text>
          <Button variant="secondary" onClick={onNext} disabled={currentIndex >= total - 1}>▶</Button>
        </div>
      </div>

      {current ? (
        <div className="mt-4 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge color={current.TOP_CURRENT ? 'indigo' : 'gray'}>
              {current.TOP_CURRENT ? 'Current' : 'Past'}
            </Badge>
            {current.state && <Badge color="blue">{current.state}</Badge>}
            {typeof current.dents === 'boolean' && (
              <Badge color={current.dents ? 'red' : 'emerald'}>Dents: {current.dents ? 'Yes' : 'No'}</Badge>
            )}
            {typeof current.corrosions === 'boolean' && (
              <Badge color={current.corrosions ? 'red' : 'emerald'}>Corrosions: {current.corrosions ? 'Yes' : 'No'}</Badge>
            )}
            {typeof current.scratches === 'boolean' && (
              <Badge color={current.scratches ? 'red' : 'emerald'}>Scratches: {current.scratches ? 'Yes' : 'No'}</Badge>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div><strong>ID Piece:</strong> {current.id_piece ?? '-'}</div>
            <div><strong>Ref Piece:</strong> {current.ref_piece ?? '-'}</div>
            <div><strong>Name Piece:</strong> {current.name_piece ?? '-'}</div>
            <div><strong>Program:</strong> {current.name_program ?? '-'}</div>

            <div><strong>Start Date:</strong> {current.start_date ?? '-'}</div>
            <div><strong>End Date:</strong> {current.end_date ?? '-'}</div>

            <div><strong>Inspection ID:</strong> {current.id_inspection ?? '-'}</div>
            <div><strong>Inspection Date:</strong> {current.inspection_date ?? '-'}</div>
            <div className="md:col-span-2"><strong>Inspection Path:</strong> {current.inspection_path ?? '-'}</div>
            <div><strong>Inspection Status:</strong> {current.inspection_status ?? '-'}</div>

            <div>
              <strong>User Validation:</strong> {current._user_validation_name || current.user_validation || '-'}
            </div>
            <div><strong>Validation Date:</strong> {current.validation_date ?? '-'}</div>

            <div><strong>Created At:</strong> {current.creation_date ?? '-'}</div>
            <div><strong>Created By:</strong> {current._user_creation_name || current.user_creation || '-'}</div>
            <div><strong>Modified At:</strong> {current.modification_date ?? '-'}</div>
            <div><strong>Modified By:</strong> {current._user_modification_name || current.user_modification || '-'}</div>

            {typeof current.deleted !== 'undefined' && (
              <div><strong>Deleted:</strong> {current.deleted ? 'Yes' : 'No'}</div>
            )}
            {typeof current.TOP_CURRENT !== 'undefined' && (
              <div><strong>Top Current:</strong> {current.TOP_CURRENT ? '1' : '0'}</div>
            )}

            {/* If backend enriches with validator names (from a view), show them */}
            {current.validator_first_name || current.validator_last_name ? (
              <div className="md:col-span-2">
                <strong>Validator Name:</strong> {`${current.validator_first_name || ''} ${current.validator_last_name || ''}`.trim()}
              </div>
            ) : null}

            <div className="md:col-span-2"><strong>Details:</strong> {current.details || '-'}</div>
          </div>

          {/* Images gallery */}
          <div className="mt-4">
            <Title className="text-base">Inspection Images</Title>
            {imgLoading && <Text>Loading images...</Text>}
            {imgError && <Text className="text-red-600">{imgError}</Text>}
            {!imgLoading && !imgError && images.length > 0 && (
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {images.map(img => (
                  <img key={img.name} src={img.url} alt={img.name} className="w-full h-56 object-cover rounded" />
                ))}
              </div>
            )}
            {!imgLoading && !imgError && images.length === 0 && (
              <Text className="text-sm text-gray-500 mt-2">No images found in inspection folder.</Text>
            )}
          </div>
        </div>
      ) : (
        <Text className="mt-4">No history data</Text>
      )}
    </Card>
  );
}
