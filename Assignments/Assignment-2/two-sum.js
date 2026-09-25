// Ishraq Chowdhury
// File: two-sum.js
// Assignment 2
// September 25, 2026
// Finds two distinct array indices whose values add up to the target using a map


/*
 * Two Sum (Straight from LeetCode 1) 
 *
 * Given an array of integers `nums` and an integer `target`, return the
 * indices of the two numbers that add up to `target`. The same element
 * can't be used twice.
 *
 * Approach: one-pass hash map.
 *   As we walk the array, we store each value we've seen along with its index.
 *   For the current number, the partner we need is (target - currentNum).
 *   If that partner is already in the map, we've found our pair.
 *
 * Time:  O(n)  - each element is visited once, Map lookups are O(1) on average
 * Space: O(n)  - the map can hold up to n entries
 *
 * LeetCode guarantees exactly one answer. Users of this page can type any
 * array, so this version returns null when no pair exists.
 */


// Accept an integer array and target, and return a two index array or null
function twoSum(nums, target) {

  // value -> index where we saw it
  const seenIndexes = new Map(); 

  // Visit each element once, using i as its zero'th pos
  for (let i = 0; i < nums.length; i++) {
    const currentNum = nums[i];

    // Subtract the current value from the target to find the required value
    const neededNum = target - currentNum;

    // A stored value comes from an earlier index, so the current element is never reused
    if (seenIndexes.has(neededNum)) {

      // Return the earlier value index and the current index as soon as a match is found
      return [seenIndexes.get(neededNum), i];
    }

    // Only store after checking, so an element never pairs with itself
    // Keep the first index for each value. Only return the first pair found while scanning
    if (!seenIndexes.has(currentNum)) {
      seenIndexes.set(currentNum, i);
    }
  }

  // Reaching the end without returning a pair means no two values meet the target
  return null;
}

