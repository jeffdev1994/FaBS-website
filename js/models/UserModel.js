        var demo = angular.module( "Demo", [] );


        // -------------------------------------------------- //
        // -------------------------------------------------- //


        // I run when the AngularJS application has been bootstrapped
        // and the dependency injector is ready to rock and roll.
        demo.run(
            function( Friend ) {


                // Create Tricia using the vanilla constructor.
                var tricia = new Friend( "Tricia", "Smith" );

                // Create Joanna using the convenience class method.
                var joanna = Friend.fromFullName( " Joanna Smith-Joe " );

                // Log the various parts to make sure values were parsed
                // and stored correctly.

                console.log(
                    tricia.getFullName(),
                    "... or simply,",
                    tricia.getFirstName()
                );

                console.log(
                    joanna.getFullName(),
                    "... or simply,",
                    joanna.getFirstName()
                );


            }
        );


        // -------------------------------------------------- //
        // -------------------------------------------------- //


        // Define an injectable trim method so we can demonstrate the
        // use of dependency injection in the next Factory.
        demo.value( "trim", jQuery.trim );


        // -------------------------------------------------- //
        // -------------------------------------------------- //


        // To define an instantiatable class / constructor, we can
        // use either the Factory() of the Value() method. I prefer
        // the Factory since it allows for dependency injection.
        demo.factory(
            "Friend",
            function( trim ) {

                // Define the constructor function.
                function Friend( firstName, lastName ) {

                    this.firstName = trim( firstName || "" );
                    this.lastName = trim( lastName || "" );

                }


                // Define the "instance" methods using the prototype
                // and standard prototypal inheritance.
                Friend.prototype = {

                    getFirstName: function() {

                        return( this.firstName );

                    },

                    getFullName: function() {

                        return( this.firstName + " " + this.lastName );

                    }

                };


                // Define the "class" / "static" methods. These are
                // utility methods on the class itself; they do not
                // have access to the "this" reference.
                Friend.fromFullName = function( fullName ) {

                    var parts = trim( fullName || "" ).split( /\s+/gi );

                    return(
                        new Friend(
                            parts[ 0 ],
                            parts.splice( 0, 1 ) && parts.join( " " )
                        )
                    );

                };


                // Return constructor - this is what defines the actual
                // injectable in the DI framework.
                return( Friend );

            }
        );