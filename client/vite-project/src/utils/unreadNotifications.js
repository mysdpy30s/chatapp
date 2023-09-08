export const unreadNotificationsFunc = (notifications) => {
  return notifications.filter((n) => n.isRead === false);
};
// notification의 isRead 상태가 false면 이 값을 unreadNotificationsFunc 함수로 리턴한다.
