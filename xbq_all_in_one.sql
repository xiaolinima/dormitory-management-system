-- ============================================
-- 一键执行脚本（两个脚本合并，直接运行）
-- ============================================

-- ============================================
-- 第一部分：快速修复（插入父表数据）
-- ============================================

-- 插入楼栋 ID = 5, 6, 7
INSERT INTO tb_building (id, name, address, total_floors, description) 
VALUES (5, '1号楼 / Корпус 1', '武汉洪山区珞喻路1号 / Ухань, р-н Хуншань, ул. Луоюй, 1', 6, '男生宿舍楼 / Мужское общежитие')
ON CONFLICT (id) DO NOTHING;

INSERT INTO tb_building (id, name, address, total_floors, description) 
VALUES (6, '2号楼 / Корпус 2', '武汉洪山区珞喻路2号 / Ухань, р-н Хуншань, ул. Луоюй, 2', 6, '女生宿舍楼 / Женское общежитие')
ON CONFLICT (id) DO NOTHING;

INSERT INTO tb_building (id, name, address, total_floors, description) 
VALUES (7, '3号楼 / Корпус 3', '武汉洪山区珞喻路3号 / Ухань, р-н Хуншань, ул. Луоюй, 3', 4, '混合宿舍楼 / Смешанное общежитие')
ON CONFLICT (id) DO NOTHING;

-- 插入楼层（building_id 5, 6, 7）
INSERT INTO tb_floor (building_id, floor_number, description)
SELECT 5, generate_series(1, 6), generate_series(1, 6) || '层 / ' || generate_series(1, 6) || ' этаж'
WHERE NOT EXISTS (SELECT 1 FROM tb_floor WHERE building_id = 5);

INSERT INTO tb_floor (building_id, floor_number, description)
SELECT 6, generate_series(1, 6), generate_series(1, 6) || '层 / ' || generate_series(1, 6) || ' этаж'
WHERE NOT EXISTS (SELECT 1 FROM tb_floor WHERE building_id = 6);

INSERT INTO tb_floor (building_id, floor_number, description)
SELECT 7, generate_series(1, 4), generate_series(1, 4) || '层 / ' || generate_series(1, 4) || ' этаж'
WHERE NOT EXISTS (SELECT 1 FROM tb_floor WHERE building_id = 7);

-- 插入用户 ID = 2
INSERT INTO tb_user (id, username, password, real_name, role, gender, grade, student_id, phone, email) 
VALUES (2, 'student1', '123456', '张三 / Чжан Сань', 'STUDENT', 'MALE', 2024, '20240001', '13800001001', 'student1@edu.cn')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 第二部分：执行原始脚本的剩余内容
-- ============================================

-- 插入房间
INSERT INTO tb_room (floor_id, room_number, capacity, current_count, gender, status, description) VALUES
(1, '101', 4, 0, 'MALE', 'AVAILABLE', '4人间 / 4-местная'),
(1, '102', 4, 0, 'MALE', 'AVAILABLE', '4人间 / 4-местная'),
(2, '201', 4, 0, 'MALE', 'AVAILABLE', '4人间 / 4-местная'),
(2, '202', 4, 0, 'MALE', 'AVAILABLE', '4人间 / 4-местная'),
(3, '301', 4, 0, 'MALE', 'AVAILABLE', '4人间 / 4-местная'),
(3, '302', 4, 0, 'MALE', 'AVAILABLE', '4人间 / 4-местная'),
(7, '101', 4, 0, 'FEMALE', 'AVAILABLE', '4人间 / 4-местная'),
(7, '102', 4, 0, 'FEMALE', 'AVAILABLE', '4人间 / 4-местная'),
(8, '201', 4, 0, 'FEMALE', 'AVAILABLE', '4人间 / 4-местная'),
(8, '202', 4, 0, 'FEMALE', 'AVAILABLE', '4人间 / 4-местная'),
(9, '301', 4, 0, 'FEMALE', 'AVAILABLE', '4人间 / 4-местная'),
(9, '302', 4, 0, 'FEMALE', 'AVAILABLE', '4人间 / 4-местная')
ON CONFLICT DO NOTHING;

-- 插入床位
INSERT INTO tb_bed (room_id, bed_number, status) VALUES
(1, '床1号 / Койка 1', 'AVAILABLE'), (1, '床2号 / Койка 2', 'AVAILABLE'),
(1, '床3号 / Койка 3', 'AVAILABLE'), (1, '床4号 / Койка 4', 'AVAILABLE'),
(2, '床1号 / Койка 1', 'AVAILABLE'), (2, '床2号 / Койка 2', 'AVAILABLE'),
(2, '床3号 / Койка 3', 'AVAILABLE'), (2, '床4号 / Койка 4', 'AVAILABLE'),
(3, '床1号 / Койка 1', 'AVAILABLE'), (3, '床2号 / Койка 2', 'AVAILABLE'),
(3, '床3号 / Койка 3', 'AVAILABLE'), (3, '床4号 / Койка 4', 'AVAILABLE'),
(4, '床1号 / Койка 1', 'AVAILABLE'), (4, '床2号 / Койка 2', 'AVAILABLE'),
(4, '床3号 / Койка 3', 'AVAILABLE'), (4, '床4号 / Койка 4', 'AVAILABLE'),
(5, '床1号 / Койка 1', 'AVAILABLE'), (5, '床2号 / Койка 2', 'AVAILABLE'),
(5, '床3号 / Койка 3', 'AVAILABLE'), (5, '床4号 / Койка 4', 'AVAILABLE'),
(6, '床1号 / Койка 1', 'AVAILABLE'), (6, '床2号 / Койка 2', 'AVAILABLE'),
(6, '床3号 / Койка 3', 'AVAILABLE'), (6, '床4号 / Койка 4', 'AVAILABLE'),
(7, '床1号 / Койка 1', 'AVAILABLE'), (7, '床2号 / Койка 2', 'AVAILABLE'),
(7, '床3号 / Койка 3', 'AVAILABLE'), (7, '床4号 / Койка 4', 'AVAILABLE'),
(8, '床1号 / Койка 1', 'AVAILABLE'), (8, '床2号 / Койка 2', 'AVAILABLE'),
(8, '床3号 / Койка 3', 'AVAILABLE'), (8, '床4号 / Койка 4', 'AVAILABLE'),
(9, '床1号 / Койка 1', 'AVAILABLE'), (9, '床2号 / Койка 2', 'AVAILABLE'),
(9, '床3号 / Койка 3', 'AVAILABLE'), (9, '床4号 / Койка 4', 'AVAILABLE'),
(10, '床1号 / Койка 1', 'AVAILABLE'), (10, '床2号 / Койка 2', 'AVAILABLE'),
(10, '床3号 / Койка 3', 'AVAILABLE'), (10, '床4号 / Койка 4', 'AVAILABLE'),
(11, '床1号 / Койка 1', 'AVAILABLE'), (11, '床2号 / Койка 2', 'AVAILABLE'),
(11, '床3号 / Койка 3', 'AVAILABLE'), (11, '床4号 / Койка 4', 'AVAILABLE'),
(12, '床1号 / Койка 1', 'AVAILABLE'), (12, '床2号 / Койка 2', 'AVAILABLE'),
(12, '床3号 / Койка 3', 'AVAILABLE'), (12, '床4号 / Койка 4', 'AVAILABLE')
ON CONFLICT DO NOTHING;

-- 更新床位和房间人数
UPDATE tb_bed SET status = 'OCCUPIED', student_id = 2 WHERE id = 1;
UPDATE tb_bed SET status = 'OCCUPIED', student_id = 3 WHERE id = 2;
UPDATE tb_bed SET status = 'OCCUPIED', student_id = 4 WHERE id = 5;
UPDATE tb_bed SET status = 'OCCUPIED', student_id = 5 WHERE id = 25;
UPDATE tb_bed SET status = 'OCCUPIED', student_id = 6 WHERE id = 26;

UPDATE tb_room SET current_count = 2 WHERE id = 1;
UPDATE tb_room SET current_count = 1 WHERE id = 2;
UPDATE tb_room SET current_count = 2 WHERE id = 7;
UPDATE tb_room SET current_count = 1 WHERE id = 8;

-- 插入更多学生（ID 3-6）
INSERT INTO tb_user (id, username, password, real_name, role, gender, grade, student_id, phone, email)
VALUES 
(3, 'student2', '123456', '李四 / Ли Сы', 'STUDENT', 'MALE', 2024, '20240002', '13800001002', 'student2@edu.cn'),
(4, 'student3', '123456', '王五 / Ван У', 'STUDENT', 'MALE', 2023, '20230001', '13800001003', 'student3@edu.cn'),
(5, 'student4', '123456', '赵六 / Чжао Лю', 'STUDENT', 'FEMALE', 2024, '20240003', '13800001004', 'student4@edu.cn'),
(6, 'student5', '123456', '孙七 / Сунь Ци', 'STUDENT', 'FEMALE', 2023, '20230002', '13800001005', 'student5@edu.cn')
ON CONFLICT (id) DO NOTHING;

-- 插入维修
INSERT INTO tb_repair (room_id, student_id, type, description, status) VALUES
(1, 2, 'REPAIR', '水龙头漏水 / Течёт кран', 'PENDING'),
(3, 3, 'REPAIR', '门锁损坏 / Сломан замок', 'PENDING'),
(7, 5, 'LIFE_SERVICE', '需要打扫 / Нужна уборка', 'COMPLETED')
ON CONFLICT DO NOTHING;

-- 插入资产
INSERT INTO tb_asset (room_id, name, quantity, condition_status, description) VALUES
(1, '空调 / Кондиционер', 2, 'GOOD', '格力空调 / Gree'),
(1, '床 / Кровать', 4, 'GOOD', '单人床 / Односпальная'),
(1, '书桌 / Письменный стол', 4, 'GOOD', '木制书桌 / Деревянный'),
(1, '衣柜 / Шкаф', 4, 'GOOD', '塑料衣柜 / Пластиковый'),
(2, '空调 / Кондиционер', 2, 'GOOD', '格力空调 / Gree'),
(2, '床 / Кровать', 4, 'DAMAGED', '床板损坏 / Сломан каркас'),
(7, '空调 / Кондиционер', 2, 'GOOD', '美的空调 / Midea'),
(7, '床 / Кровать', 4, 'GOOD', '单人床 / Односпальная'),
(7, '书桌 / Письменный стол', 4, 'GOOD', '木制书桌 / Деревянный'),
(8, '空调 / Кондиционер', 2, 'LOST', '空调丢失 / Кондиционер утерян')
ON CONFLICT DO NOTHING;

-- 插入调宿
INSERT INTO tb_transfer (student_id, from_room_id, to_room_id, reason, status) VALUES
(2, 1, 3, '希望换到更高楼层 / Хочу этаж повыше', 'PENDING')
ON CONFLICT DO NOTHING;

-- 插入费用
INSERT INTO tb_fee (student_id, semester, amount, status, due_date) VALUES
(2, '2024-2025-1', 2500.00, 'PAID', '2024-09-01'),
(3, '2024-2025-1', 2500.00, 'UNPAID', '2024-09-01'),
(4, '2024-2025-1', 2500.00, 'PAID', '2024-09-01'),
(5, '2024-2025-1', 2500.00, 'UNPAID', '2024-09-01'),
(6, '2024-2025-1', 2500.00, 'OVERDUE', '2024-09-01')
ON CONFLICT DO NOTHING;

-- ============================================
-- ✅ 完成！
-- ============================================

SELECT '🎉 所有数据插入成功！' AS result;

-- 验证数据统计
SELECT 
    (SELECT COUNT(*) FROM tb_building) AS 楼栋数,
    (SELECT COUNT(*) FROM tb_floor) AS 楼层数,
    (SELECT COUNT(*) FROM tb_room) AS 房间数,
    (SELECT COUNT(*) FROM tb_bed) AS 床位数,
    (SELECT COUNT(*) FROM tb_user) AS 用户数;
