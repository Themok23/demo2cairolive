import StarRating from '../ui/StarRating';

interface ReviewCardProps {
  userName: string;
  userAvatar?: string | null;
  rating: number;
  title: string | null;
  body: string;
  pros: string | null;
  cons: string | null;
  createdAt: string;
}

export default function ReviewCard({
  userName,
  userAvatar,
  rating,
  title,
  body,
  pros,
  cons,
  createdAt,
}: ReviewCardProps) {
  const date = new Date(createdAt).toLocaleDateString('en-EG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="rounded-card bg-surface border border-muted p-5">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          {userAvatar ? (
            <img src={userAvatar} alt={userName} className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <span className="text-sm font-semibold text-primary">{userName[0]?.toUpperCase()}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm text-secondary">{userName}</span>
            <span className="text-xs text-text-muted">{date}</span>
          </div>
          <StarRating rating={rating} size={14} />
        </div>
      </div>
      {title && <h4 className="mt-3 font-semibold text-secondary">{title}</h4>}
      <p className="mt-2 text-sm text-text-muted leading-relaxed">{body}</p>
      {(pros || cons) && (
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {pros && (
            <div className="rounded-lg bg-accent-green/10 p-3">
              <span className="text-xs font-semibold text-accent-green uppercase">Pros</span>
              <p className="mt-1 text-sm text-text-primary">{pros}</p>
            </div>
          )}
          {cons && (
            <div className="rounded-lg bg-primary/10 p-3">
              <span className="text-xs font-semibold text-primary uppercase">Cons</span>
              <p className="mt-1 text-sm text-text-primary">{cons}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
