from app.Database import SessionLocal
from app.models.User import User
from app.models.disaster_level import disasterlevel
from app.models.user_scopes import UserDistrictScope
from app.models.transfers import transfer

db = SessionLocal()

ids = [u.id for u in db.query(User).filter(
    User.email.like('cd_%@kaiju.com') | User.email.like('qc_%@kaiju.com')
)]

db.query(transfer).filter(transfer.requester_id.in_(ids)).delete(synchronize_session=False)
db.query(disasterlevel).filter(disasterlevel.changed_by_id.in_(ids)).delete(synchronize_session=False)
db.query(UserDistrictScope).filter(UserDistrictScope.user_id.in_(ids)).delete(synchronize_session=False)
db.commit()

db.query(User).filter(User.id.in_(ids)).delete(synchronize_session=False)
db.commit()

print(f"Cleaned up {len(ids)} e2e test user(s).")
db.close()
