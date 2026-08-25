import psycopg2

passwords = ["Nexus_password", "postgres", "admin", "root", "", "password"]
users = ["postgres", "nexus", "admin"]

success = False
for u in users:
    for p in passwords:
        try:
            conn = psycopg2.connect(dbname="nexus_db", user=u, password=p, host="127.0.0.1", port=5432)
            print(f"SUCCESS: user '{u}' password '{p}'")
            conn.close()
            success = True
            break
        except Exception as e:
            pass
    if success:
        break

if not success:
    print("FAILED ALL COMBINATIONS")
