SELECT title, description, min_order_value, reward_point, deadline
FROM `mission`
WHERE store_id = 1 AND deadline > NOW()
ORDER BY deadline ASC;
