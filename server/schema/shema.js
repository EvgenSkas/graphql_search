const graphql = require("graphql");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull
} = graphql;

const Movies = require("../models/movie");
const Directors = require("../models/director");

// const movies = [
//   { "name": "Pulp Fiction", "genre": "Crime", "directorId": },
//   { "name": "1984", "genre": "Sci-fi", "directorId":  },
//   { "name": "V for vendetta", "genre": "Sci-Fi-triller", "directorId": },
//   { "name": "Snatch", "genre": "Crime-comedy", "directorId":},
//   { "name": "Reservoir Dogs", "genre": "Crime", "directorId": },
//   { "name": "The Hateful Eight", "genre": "Sci-fi", "directorId": },
//   { "name": "Inglourious Basterds", "genre": "Crime", "directorId": },
//   {
//     "name": "Lock, Stock and two Smoking Barrels",
//     "genre": "Crime-comedy",
//     "directorId":
//   }
// ];

// const directorsJson = [
//   { "name": "Quentin Tarantino", "age": 55 }, //5e414d251c9d4400000c8bf3
//   { "name": "Michael Radford", "age": 72 }, 5e414e091c9d4400000c8bf5
//   { "name": "James McTeigue", "age": 51 }, 5e414e291c9d4400000c8bf6
//   { "name": "Gue Ritchie", "age": 50 }, 5e414e3f1c9d4400000c8bf7
// ];

const MovieType = new GraphQLObjectType({
  name: "Movie",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLNonNull(GraphQLString) },
    genre: { type: GraphQLNonNull(GraphQLString) },
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
            $set: { name: args.name, age: args.age }
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
        directorId: { type: GraphQLID }
      },
      resolve(parent, args) {
        const movie = new Movies({
          name: args.name,
          genre: args.genre,
          directorId: args.directorId
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
        directorId: { type: GraphQLID }
      },
      resolve(parent, args) {
        return Movies.findByIdAndUpdate(
          args.id,
          {
            $set: {
              name: args.name,
              genre: args.genre,
              directorId: args.directorId
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
