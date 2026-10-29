SELECT 
    s.shop_name,
    m.mission_name,
    me.yes_or_no
FROM Login_system me
JOIN mission m ON me.mission_id = m.mission_id
JOIN shop s ON m.shop_id = s.shop_id
WHERE me.user_id = 1 
  AND me.yes_or_no = FALSE
ORDER BY me.id DESC;