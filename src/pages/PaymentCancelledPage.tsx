import { Link, useSearchParams } from "react-router-dom";
import { XCircle } from "lucide-react";

const JOINIT_URL = "https://app.joinit.com/o/divine-collective";

const PaymentCancelledPage = () => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");

  const isMembership = type === "membership";

  return (
    <div className="section-padding bg-background">
      <div className="container-main text-center max-w-lg mx-auto">
        <XCircle size={64} className="text-muted-foreground mx-auto mb-6" />
        <h1 className="font-serif text-primary italic text-[36px] md:text-[40px] mb-4">
          Payment Cancelled
        </h1>
        <p className="text-muted-foreground mb-8">
          Your payment was not completed. No charges have been made.
        </p>
        {isMembership ? (
          <a href={JOINIT_URL} target="_blank" rel="noopener noreferrer" className="btn-pill-green inline-block">
            TRY AGAIN
          </a>
        ) : (
          <Link to="/checkout" className="btn-pill-green inline-block">
            TRY AGAIN
          </Link>
        )}
      </div>
    </div>
  );
};

export default PaymentCancelledPage;
