require('should');
const serializer  = require(process.cwd()+"/lib/server/serializer/objectSerializer");

describe("Serializer", () => {

    it("Serialize/Deserialize simple object", () => {

        const Test = function(name){
            this.name = name;
            this.toString = () => {
                return this.name;
            }
        };

        const string = serializer.serialize(new Test("John"));
        const materialized = serializer.deserialize(string);

        materialized.toString().should.be.eql('John');
    });

    it("Serialize/Deserialize two levels object", () => {

        const TestComposite = function(age){
            this.age = age;
            this.toString = function(){
                return this.age;
            };
        };

        const Test = function(name, age){
            this.name = name;
            this.age = new TestComposite(age);

            this.toString = () => {
                return this.name+" : "+this.age.toString();
            }
        };

        const string = serializer.serialize(new Test("John", 25));
        const materialized = serializer.deserialize(string);

        materialized.toString().should.be.eql('John : 25');
    });
});