# Common Backend Design Patterns

## Creational Patterns
- **Singleton**: Ensures a class has only one instance and provides a global point of access to it.
- **Factory Method**: Defines an interface for creating an object, but lets subclasses alter the type of objects that will be created.
- **Abstract Factory**: Provides an interface for creating families of related or dependent objects without specifying their concrete classes.

## Structural Patterns
- **Adapter**: Allows objects with incompatible interfaces to collaborate.
- **Decorator**: Attaches new behaviors to objects by placing them inside special wrapper objects that contain the behaviors.
- **Facade**: Provides a simplified interface to a library, a framework, or any other complex set of classes.

## Behavioral Patterns
- **Observer**: Defines a one-to-many dependency between objects so that when one object changes state, all its dependents are notified and updated automatically.
- **Strategy**: Defines a family of algorithms, puts each of them into a separate class, and makes their objects interchangeable.
- **Command**: Turns a request into a stand-alone object that contains all information about the request.

## Concurrency Patterns
- **Producer-Consumer**: Separates the production of data from its consumption, often using a queue.
- **Worker Pool**: Manages a group of worker threads or processes to execute tasks concurrently.

## Best Practices for Using Design Patterns
- **Understand the Problem**: Don't force a pattern where it doesn't fit.
- **Start Simple**: Introduce patterns only when the complexity warrants it.
- **Know the Trade-offs**: Each pattern has its pros and cons.
