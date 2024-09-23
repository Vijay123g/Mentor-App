const db = require("../connection/database");

module.exports = class User {
    constructor (name, email , role , password){
        this.name = name;
        this.email =email;
        this.role = role;
        this.password = password;

    }

    static find(email) {
        return db.execute(
            'SELECT * FROM users WHERE email=?',
            [email]
        );  
    }

    static findById(id) {
      return db.execute('SELECT * FROM users WHERE user_id=?', [id]);
  }

    static async save(user) {
        const name = user.name || null;
        const email = user.email || null;
        const role = user.role || "Faculty";
        const password = user.password || null;
      
        console.log("Values after null checks:", name, email, role, password);
      
        try {
          const [result] = await db.execute('INSERT INTO users (name, email, role, password) VALUES (?,?,?,?)', [name, email, role, password]);
          return result.affectedRows > 0;
        } catch (error) {
          console.error('Error saving user:', error);
          throw error;
        }
      }

      static async update(id, updatedUser) {
        const name = updatedUser.name || null;
        const email = updatedUser.email || null;
        const role = updatedUser.role || "Faculty";
        const password = updatedUser.password || null;

        try {
            const [result] = await db.execute(
                'UPDATE users SET name=?, email=?, role=?, password=? WHERE id=?', 
                [name, email, role, password, id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    }

    static delete(id) {
        return db.execute('DELETE FROM users WHERE id=?', [id]);
    }

    static async createFaculty(facultyDetails) {
      const { name, email, password } = facultyDetails;
      const role = 'Faculty';
  
      try {
        const [result] = await db.execute(
          'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
          [name, email, password, role]
        );
        return result.affectedRows > 0;
      } catch (error) {
        console.error('Error creating faculty:', error);
        throw error;
      }
    }

    static findByRole(role) {
      return db.execute('SELECT * FROM users WHERE role = ?', [role]);
    }
    };
    
