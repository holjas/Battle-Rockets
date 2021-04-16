import "./UserInput.css";
function UserInput () {


    return (
        <div>
            <form>
                <label>
                Name:
                    <input type="text" name="name" />
                </label>
                <input type="submit" value="Submit" />
            </form>
        </div>

    )
}


export default UserInput;