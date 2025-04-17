
import { useSearchParams } from 'react-router-dom';
import { LoadingState } from '@/components/reservation/LoadingState';
import { ErrorState } from '@/components/reservation/ErrorState';
import { SuccessState } from '@/components/reservation/SuccessState';
import { usePaymentVerification } from '@/hooks/usePaymentVerification';

const ReservationSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { isLoading, bookingDetails } = usePaymentVerification(sessionId);
  
  if (isLoading) {
    return <LoadingState />;
  }
  
  if (!sessionId || !bookingDetails) {
    return <ErrorState />;
  }
  
  return (
    <div className="container max-w-4xl mx-auto py-12">
      <SuccessState 
        bookingId={bookingDetails.id}
        spaceTitle={bookingDetails.space_title}
      />
    </div>
  );
};

export default ReservationSuccess;
