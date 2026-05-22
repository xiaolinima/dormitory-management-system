-- ============================================
-- 宿舍申请表创建脚本
-- ============================================

-- 创建 tb_application 表
CREATE TABLE IF NOT EXISTS tb_application (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL,
    gender VARCHAR(10) NOT NULL,
    remark TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    apply_time TIMESTAMP,
    handle_time TIMESTAMP,
    handler_id BIGINT,
    handle_result TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    CONSTRAINT fk_application_student FOREIGN KEY (student_id) REFERENCES tb_user(id),
    CONSTRAINT fk_application_handler FOREIGN KEY (handler_id) REFERENCES tb_user(id)
);

-- 添加索引
CREATE INDEX IF NOT EXISTS idx_application_student_id ON tb_application(student_id);
CREATE INDEX IF NOT EXISTS idx_application_status ON tb_application(status);

-- ============================================
-- 插入一些示例数据
-- ============================================

-- 插入示例申请
INSERT INTO tb_application (student_id, gender, remark, status)
VALUES
(2, 'MALE', '需要安静的学习环境 / Требуется тихая среда для учебы', 'PENDING'),
(3, 'MALE', '和同学一起住 / Хочу жить с одногрупниками', 'APPROVED'),
(4, 'FEMALE', '希望住在低楼层 / Хочу жить на низком этаже', 'REJECTED')
ON CONFLICT DO NOTHING;

-- 查看表结构和数据
SELECT '表创建成功！' as message;
SELECT id, student_id, gender, status FROM tb_application;
