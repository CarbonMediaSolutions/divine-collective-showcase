import { QRCodeSVG } from "qrcode.react";
import { format } from "date-fns";

interface MembershipCardPreviewProps {
  memberName: string;
  memberEmail: string | null;
  expiryDate: Date | null;
}

const MembershipCardPreview = ({ memberName, memberEmail, expiryDate }: MembershipCardPreviewProps) => {
  return (
    <div
      className="relative w-[320px] rounded-2xl overflow-hidden shadow-2xl"
      style={{ background: "linear-gradient(145deg, #08512f 0%, #0a6b3e 40%, #064025 100%)" }}
    >
      {/* Shine overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 50%, transparent 100%)",
        }}
      />

      <div className="relative z-10 p-6">
        {/* Top row */}
        <div className="flex items-center justify-between mb-8">
          <p className="text-[10px] tracking-[3px] uppercase font-bold text-white/70">
            The Divine Collective
          </p>
          <span className="text-white/50 text-lg">🌿</span>
        </div>

        {/* Member name */}
        <p className="font-serif text-white text-xl leading-tight mb-1">{memberName}</p>
        <p className="text-[10px] tracking-[2px] uppercase font-bold text-emerald-300/80 mb-8">
          Active Member
        </p>

        {/* Bottom row */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[9px] tracking-[1.5px] uppercase text-white/50 mb-1">Valid Until</p>
            <p className="text-white font-semibold text-sm">
              {expiryDate ? format(expiryDate, "dd MMM yyyy") : "—"}
            </p>
          </div>
          {memberEmail && (
            <div className="bg-white rounded-md p-1">
              <QRCodeSVG value={memberEmail} size={44} level="M" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MembershipCardPreview;
