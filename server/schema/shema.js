const graphql = require("graphql");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLBoolean,
  GraphQLNonNull
} = graphql;

const Movies = require("../models/movie");
const Directors = require("../models/director");

const MovieType = new GraphQLObjectType({
  name: "Movie",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLNonNull(GraphQLString) },
    genre: { type: GraphQLNonNull(GraphQLString) },
    watched: { type: GraphQLNonNull(GraphQLBoolean) },
    rate: { type: GraphQLInt },
    director: {
      type: DirectorType,
      resolve(parent, args) {
        return Directors.findById(parent.directorId);
      }
    }
  })
});

const DirectorType = new GraphQLObjectType({
  name: "Director",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLNonNull(GraphQLString) },
    age: { type: GraphQLNonNull(GraphQLInt) },
    movies: {
      type: new GraphQLList(MovieType),
      resolve(parent, args) {
        return Movies.find({ directorId: parent.id });
      }
    }
  })
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: () => ({
    addDirector: {
      type: DirectorType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        age: { type: GraphQLNonNull(GraphQLInt) }
      },
      resolve(parent, args) {
        const director = new Directors({
          name: args.name,
          age: args.age
        });
        return director.save();
      }
    },
    updateDirector: {
      type: DirectorType,
      args: {
        id: { type: GraphQLID },
        name: { type: GraphQLNonNull(GraphQLString) },
        age: { type: GraphQLNonNull(GraphQLInt) }
      },
      resolve(parent, args) {
        return Directors.findByIdAndUpdate(
          args.id,
          {
            $set: {
              name: args.name,
              age: args.age
            }
          },
          { new: true }
        );
      }
    },
    deleteDirector: {
      type: DirectorType,
      args: {
        id: { type: GraphQLID }
      },
      resolve(parent, args) {
        return Directors.findByIdAndRemove(args.id);
      }
    },
    addMovie: {
      type: MovieType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        genre: { type: GraphQLNonNull(GraphQLString) },
        directorId: { type: GraphQLID },
        watched: { type: GraphQLNonNull(GraphQLBoolean) },
        rate: { type: GraphQLInt }
      },
      resolve(parent, args) {
        const movie = new Movies({
          name: args.name,
          genre: args.genre,
          directorId: args.directorId,
          watched: args.watched,
          rate: args.rate
        });
        return movie.save();
      }
    },
    updateMovie: {
      type: MovieType,
      args: {
        id: { type: GraphQLID },
        name: { type: GraphQLNonNull(GraphQLString) },
        genre: { type: GraphQLNonNull(GraphQLString) },
        directorId: { type: GraphQLID },
        watched: { type: GraphQLNonNull(GraphQLBoolean) },
        rate: { type: GraphQLInt }
      },
      resolve(parent, args) {
        return Movies.findByIdAndUpdate(
          args.id,
          {
            $set: {
              name: args.name,
              genre: args.genre,
              directorId: args.directorId,
              watched: args.watched, 
              rate: args.rate
            }
          },
          { new: true }
        );
      }
    },
    deleteMovie: {
      type: MovieType,
      args: {
        id: { type: GraphQLID }
      },
      resolve(parent, args) {
        return Movies.findByIdAndRemove(args.id);
      }
    }
  })
});

const Query = new GraphQLObjectType({
  name: "Query",
  fields: () => ({
    movies: {
      type: new GraphQLList(MovieType),
      resolve(parent, args) {
        return Movies.find({});
      }
    },
    movie: {
      type: MovieType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Movies.findById(args.id);
      }
    },
    directors: {
      type: new GraphQLList(DirectorType),
      resolve(parent, args) {
        return Directors.find({});
      }
    },
    director: {
      type: DirectorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Directors.findById(args.id);
      }
    }
  })
});

module.exports = new GraphQLSchema({
  query: Query,
  mutation: Mutation
});
