package ILMT::PAN::HIN;
use strict;
use warnings;
use Data::Dumper;
use ILMT::Translator;

my @seq = (
    "Tokenizer",
);

my $langpair_obj = new_translator ILMT::Translator("PAN", "HIN", \@seq);
