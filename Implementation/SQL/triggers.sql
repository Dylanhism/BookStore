CREATE TRIGGER upd_check BEFORE UPDATE ON Book FOR EACH ROW
    BEGIN
        IF NEW.quantity < 11 THEN
            SET NEW.quantity = 50;
        END IF;
    END;
/*Trigger to add books to the store when a limit of 10 or less in quantity is reached*/