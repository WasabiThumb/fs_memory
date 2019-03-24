# fs_memory

## A lightweight wrapper for fs meant for storing small, indexed data across sessions.

### Installing
To start with fs_memory, go to your project directory, open up a console with NPM, and use the command below.
```
npm install fs_memory_bits
```

To include it in your project, place this header in your JavaScript file.
```
const fsmem = require("fs_memory_bits")
```

### Usage
Here is a basic script to make sure everything was installed correctly:
```
fsb.setValue("foo", "bar").then(resp => {
	fsb.getValue("foo").then(resp => console.log(resp)).catch(console.error);
}).catch(console.error);
```
After this is ran, you should see "bar" written in your console, and a data.dat file in your project folder. The data.dat file can be moved and renamed in the program, but it is still a vital file that stores all of the information.


If you would like to change the data.dat file location or name, simply...
```
fsb.changeDataDirectory("./someFolder")
fsb.changeDataFile("someFile.name")
```

## Functions
Quick rundown of all of the functions

```
fsb.setValue(string id, string value)
```
Returns Promise<string id>
Accepts boolean, array, integer, and string values. Attaches a value to an ID which can be accessed with getValue, even across sessions.

```
fsb.getValue(string id)
```
Returns Promise<(bool || array || integer || string)>
Grabs the value associated with this ID.

```
fsb.changeDataDirectory(string dir)
```
Returns undefined
Changes the default data.dat location.

```
fsb.changeDataFile(string fname)
```
Returns undefined
Changes the default data.dat filename.

```
fsb.delValue(id)
```
Returns Promise<string id>
Removes the existance of both the value and self of the ID specified.

```
fsb.clear()
```
Returns undefined
Clears all settings.
